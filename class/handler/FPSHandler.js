class FPSHandler {
    static elem;
    static filterStrength = 60;
    static frameTime = 0;
    static lastLoop = new Date();
    static thisLoop;
    
    static initialize() {
        this.elem = document.getElementById("debug-fps");
    }
    static updateFrames() {
        var thisFrameTime = (this.thisLoop = new Date) - this.lastLoop;
        this.frameTime += (thisFrameTime - this.frameTime) / this.filterStrength;
        this.lastLoop = this.thisLoop;
    }
    static updateElement() {
        this.elem.innerHTML = `FPS: ${(1000/this.frameTime).toFixed(1)}`;
    }
}