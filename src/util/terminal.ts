import { ITerminalOptions, Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import * as WebfontLoader from 'xterm-webfont';

export class Terminal extends XTerminal {
  private fitAddon: FitAddon;
  constructor(opts?: ITerminalOptions) {
    super(opts);
    this.fitAddon = new FitAddon();
    this.loadAddon(this.fitAddon);
    this.loadAddon(new WebfontLoader());
  }
  public fit() {
    this.fitAddon.fit();
  }
}
