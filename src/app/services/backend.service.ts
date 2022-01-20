import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Connection,
  BrowserWebSocketTransport,
  TicketAuthProvider,
  WampDict,
  BrowserMSGPackSerializer,
} from '@verkehrsministerium/kraftfahrstrasse';
import { Deferred } from '../../util/queueable';
import { ConfigService } from './config.service';

const random = () => Math.random().toString(36).substring(7);

interface IConnectionConfig {
  user: string;
  pass: string;
}
enum EConnState {
  Disconnected,
  Connecting,
  Connected,
}

export class ConsoleInstance {
  public output: Observable<string>;
  public input: Observable<ArrayBuffer>;
  public onResize = new Subject<[number, number]>();

  private _encoder: any;
  private _decoder: any;
  private inputHandler = new Subject<string>();

  constructor(inData: Observable<ArrayBuffer>, private _onClose: Promise<void>) {
    this._encoder = new (window as any).TextEncoder();
    this._decoder = new (window as any).TextDecoder();
    this.output = inData.pipe(map(bin => this._decoder.decode(bin, { stream: true })));
    this.input = this.inputHandler.pipe(map(str => this._encoder.encode(str).buffer));
  }

  public onClose(): Promise<void> {
    return this._onClose;
  }

  public sendInput(input: string): void {
    this.inputHandler.next(input);
  }
  public resize(w: number, h: number): void {
    this.onResize.next([w, h]);
  }
}

@Injectable()
export class BackendService {
  private _connection: Connection;
  private _instanceid: string;
  private _ready: boolean;
  private _state = new BehaviorSubject<EConnState>(EConnState.Disconnected);

  constructor(private config: ConfigService) {
    const connconfig = localStorage.getItem('connconfig');
    let user: IConnectionConfig = {
      pass: random(),
      user: random(),
    };
    if (!!connconfig) {
      user = JSON.parse(connconfig);
    } else {
      localStorage.setItem('connconfig', JSON.stringify(user));
    }
    this.config.config.then((cfg) => {

      this._connection = new Connection({
        transport: BrowserWebSocketTransport,
        authProvider: new TicketAuthProvider(user.user, async () => ({
          signature: user.pass
        })),
        logFunction: () => {},
        endpoint: cfg.endpoint,
        realm: cfg.realm,
        serializer: new BrowserMSGPackSerializer(),
      });
      this._state.subscribe(state => {
        if (state === EConnState.Disconnected) {
          // if we're disconnected (whyever, e.g. server is dead, connection lost, etc...)
          setTimeout(() => {
            console.log('Connecting!');
            this._state.next(EConnState.Connecting);
            console.log('Opening!');
            this._connection.Open().then((det) => {
              this._instanceid = (det.authextra || {})['containerid'] || '';
              this._ready = (det.authextra || {})['ready'] || false;
              if (!this._ready) {
                this._connection.Subscribe<[string], WampDict>(`rocks.git.${this._instanceid}.state`, args => {
                  if (args[0] === 'ready') {
                    this._ready = true;
                    console.log('State transition to ready state');
                    this._state.next(EConnState.Connected);
                  }
                });
              } else {
                console.log('Connected, container already running,instance:', this._instanceid);
                this._state.next(EConnState.Connected);
              }
              this._connection.OnClose().then((close) => {
                console.log('Connection closed:', close);
                // Connection closed, whyever, maybe log?
                this._state.next(EConnState.Disconnected);
              }, (err) => {
                console.error('OnClose error:', err);
                // Connection closed with an error...
                this._state.next(EConnState.Disconnected);
              });
            }, (err) => {
              console.error('OnOpen error:', err);
              // Failed to connect, maybe log error.
              this._state.next(EConnState.Disconnected);
            });
          }, 1000);
        }
      });
    });
  }

  public async createConsole(w: number, h: number): Promise<ConsoleInstance> {
    // Wait until we're connected to the server
    const onConnect = new Deferred();
    const connectSub = this._state.subscribe(st => {
      if (st === EConnState.Connected) {
        onConnect.resolve();
      }
    });
    await onConnect.promise;
    connectSub.unsubscribe();
    const id = random();
    const closed = new Deferred<void>();
    const exitSub = await this._connection.Subscribe(`rocks.git.tui.${this._instanceid}.${id}.exit`, () => {
      closed.resolve();
    });
    const inputSubject = new ReplaySubject<ArrayBuffer>(100);
    const outputSub = await this._connection.Subscribe(`rocks.git.tui.${this._instanceid}.${id}.out`, (args: [ArrayBuffer]) => {
        inputSubject.next(args[0]);
      });

    closed.promise.then(() => {
      exitSub.Unsubscribe().then(() => {}, () => {});
      outputSub.Unsubscribe().then(() => {}, () => {});
    });

    const result = new ConsoleInstance(inputSubject, closed.promise);
    result.input.subscribe(data => {
      this._connection.Call(`rocks.git.tui.${this._instanceid}.${id}.input`, [data])[0].catch(err => {
        console.error('Failed to send input:', err);
      });
    });
    result.onResize.subscribe(([newW, newH]) => {
      this._connection.Call(`rocks.git.tui.${this._instanceid}.${id}.resize`, [newW, newH])[0].catch(err => {
        console.error('Failed to resize terminal:', err);
      });
    });
    try {
      await this._connection.Call(`rocks.git.tui.${this._instanceid}.create`, [id, w, h])[0];
    } catch (err) {
      closed.resolve();
      throw err;
    }
    return result;
  }
}
