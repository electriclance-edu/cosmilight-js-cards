class Consequence {
    constructor(type,param = []) {
      this.type = type;
      this.param = param;
  
      if (!Object.keys(consequenceTypes).includes(this.type)) {
        console.log("class Consequence: consequence type '" + this.type + "' does not exist, defaulting to none.");
      }
    }
    trigger() {
      consequenceTypes[this.type](this.param);
    }
    static triggerSet(set) {
      if (!Array.isArray(set)) {
        set = [set];
      }
      set.forEach((consequence) => {
        consequence.trigger();
      });
    }
  }
  var consequenceTypes = {
    none:()=>{},
  }
  