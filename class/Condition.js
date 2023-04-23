class Condition {
    constructor(type,param) {
      this.type = type;
      this.param = param;
    }
    //returns whether or not the condition's type and parameters are satisfied
    //ie. new Condition("resource",["water",1]) will return true if the player has >=1 water
    isSatisfied() {
      if (!Object.keys(conditionChecks).includes(this.type)) {
        console.log(`Condition.isSatisfied(): function corresponding to type '${this.type}' does not exist`);
        return true;
      }
      return conditionChecks[this.type](this.param);
    }
    //STATIC: checks if a set of conditions are all satisfied
    static setSatisfied(conditionSet) {
      if (conditionSet == false) {
        return true;
      } else if (!Array.isArray(conditionSet)) {
        conditionSet = [conditionSet];
      }
  
      var allConditionsSatisfied = true;
      conditionSet.forEach((condition) => {
        if (!condition.isSatisfied()) {
          allConditionsSatisfied = false;
        }
      });
      return allConditionsSatisfied;
    }
  }
  //dictionary of functions that check whether a given type condition is satisfied according to the current gamestate
  var conditionChecks = {
    none:()=>{
      return true;
    }
    cardExists:(card)=>{
  		return true;
    }
  }
  