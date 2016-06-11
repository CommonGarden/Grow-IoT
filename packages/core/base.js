const share = {}

share.BaseDocument = class BaseDocument extends Document {
  constructor() {
    super();
  }

  Meta () {
  	return { abstract: true };
  }
}

export default share;
