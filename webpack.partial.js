module.exports = {
  resolve: {
    fallback: {
      util: false,
      assert: false,
      net: false,
      http: false,
      stream: false,
      crypto: false,
      tls: false,
      https: false,
      zlib: false,
      bufferutil: false,
      'utf-8-validate': false,
    },
  },
};
