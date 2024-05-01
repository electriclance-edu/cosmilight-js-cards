class LightHandler {
    static dark = new RGBA(15,0,30,0.7);
    // static dark = new RGBA(9,0,22,0.1);
    // static dark = new RGBA(9,0,22,0.9);
    // static dark = new RGBA(7,0,15,1);
    static lightPoints = {
        "player":new LightPoint(0,0,{strength:1500,waver:1,color:new RGBA(0,0,0,0),faintness:0.5}),
        "player2":new LightPoint(0,0,{strength:1000,waver:10,color:new RGBA(150,50,230,0.1),faintness:0.9}),
    };
    static canvas;
    static canvasCenter;
    static zoomFactor = 1;
    static initialize() {
        var canvas = document.getElementById("LightCanvas");
        canvas.width = window.innerWidth / LightHandler.zoomFactor; 
        canvas.height = window.innerHeight / LightHandler.zoomFactor;
        LightHandler.canvas = canvas;
        LightHandler.canvasCenter = new Point(LightHandler.canvas.width/2,LightHandler.canvas.height/2);

        LightHandler.renderAllLight();
    }
    static moveLight(id,x,y) {
        let point = this.getLight(id);
        if (point) {
            point.setX(x);
            point.setY(y);
        }
    }
    static addLight(id,lightPoint) {
        this.lightPoints[id] = lightPoint;
        this.lightPoints[id].age = 0;
    }
    static removeLight(id) {
        this.lightPoints[id].delete = true;
    }
    static getLight(id) {
        if (LightHandler.lightPoints[id]) {
            return LightHandler.lightPoints[id];
        } 
        return false;
    }
    static canvasClear() {
        LightHandler.canvas.getContext("2d").clearRect(0, 0, LightHandler.canvas.width, LightHandler.canvas.height);
    }
    static canvasSetBase() {
        var ctx = LightHandler.canvas.getContext("2d");
        ctx.save()
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.rect(0,0,LightHandler.canvas.width,LightHandler.canvas.height);
        ctx.fillStyle = `rgba(${this.dark.r},${this.dark.g},${this.dark.b},${this.dark.a})`;
        ctx.fill();
        ctx.restore();
    }
    static renderAllLight() {
        LightHandler.canvasClear();
        LightHandler.canvasSetBase();

        var lightPointIds = Object.keys(LightHandler.lightPoints);

        let translated = Point.translate(LightHandler.canvasCenter,mousePosition);
        LightHandler.moveLight("player",-translated.x,translated.y);
        LightHandler.moveLight("player2",-translated.x,translated.y);

        lightPointIds.forEach((id) => {
            let light = LightHandler.getLight(id);
            let strength = LightHandler.renderLightStrength(light);

            light.age++;

            if (strength <= 0.05) {
                return;
            }

            let square = LightHandler.renderLightPosition(light,strength);
            LightHandler.renderLightMask(light,strength,square);
        });
        lightPointIds.forEach((id) => {
            let light = LightHandler.getLight(id);
            let strength = LightHandler.renderLightStrength(light);

            if (strength <= 0.05) {
                return;
            }

            let square = LightHandler.renderLightPosition(light,strength);
            LightHandler.renderLightColor(light,strength,square);

            if (light.delete) {
                light.strength -= 0.05;
                light.strength *= 0.9;
                light.faintness *= 0.9;
                
                if (light.strength < 0.05) {
                    delete this.lightPoints[id];
                }
            }
        });
    }
    static renderLightStrength(light) {
        var strength = light.getStrength(); //units: in pixels
        if (light.doesWaver()) {
            strength = light.getRandomWaveredStrength(); //units: in pixels
        }
        return strength;
    }
    static renderLightPosition(light,strength) {
        var ctx = LightHandler.canvas.getContext("2d");
        var translatedLight = new Point(light.x,light.y);
        const square = generateSquare(new Point(translatedLight.x, -translatedLight.y),strength);
        square.center = decentralizePoint(LightHandler.canvasCenter, square.center);
        square.cornerA = decentralizePoint(LightHandler.canvasCenter, square.cornerA);
        square.cornerB = decentralizePoint(LightHandler.canvasCenter, square.cornerB);
        return square;
    }
    //create color gradient
    static renderLightColor(light,strength,square) {
        var ctx = LightHandler.canvas.getContext("2d");
        ctx.beginPath();
        const gradient_color = ctx.createRadialGradient(square.center.x,square.center.y,1,square.center.x,square.center.y,square.width / 2);
        const colorString = `${light.color.r},${light.color.g},${light.color.b}`;
        gradient_color.addColorStop(0.2,`rgba(${colorString},${light.color.a * 1}`);
        gradient_color.addColorStop(0.55,`rgba(${colorString},${light.color.a * 0.7}`);
        gradient_color.addColorStop(0.7,`rgba(${colorString},${light.color.a * 0.4}`);
        gradient_color.addColorStop(1,`rgba(${colorString},${light.color.a * 0}`);
        ctx.fillStyle = gradient_color;
        ctx.globalCompositeOperation = "source-over";
        ctx.rect(square.cornerA.x,square.cornerA.y,square.width,square.width);
        ctx.fill();
        // ctx.transform(1, 0, 0, 1, 0, 0);
    }
    //create mask gradient
    static renderLightMask(light,strength,square) {
        var ctx = LightHandler.canvas.getContext("2d");
        ctx.beginPath();
        const gradient_mask = ctx.createRadialGradient(
            square.center.x / LightHandler.zoomFactor,
            square.center.y / LightHandler.zoomFactor,
            1,
            square.center.x / LightHandler.zoomFactor,
            square.center.y / LightHandler.zoomFactor,
            square.width / 2 / LightHandler.zoomFactor
        );

        let perceivedFaintness = light.faintness * (Math.min(100,light.age) / 100);
        gradient_mask.addColorStop(0.2,`rgba(0,0,0,${1 * perceivedFaintness})`);
        gradient_mask.addColorStop(0.55,`rgba(0,0,0,${0.7 * perceivedFaintness})`);
        gradient_mask.addColorStop(0.7,`rgba(0,0,0,${0.4 * perceivedFaintness})`);
        gradient_mask.addColorStop(1,`rgba(0,0,0,0)`);
        ctx.fillStyle = gradient_mask;
        ctx.globalCompositeOperation = "destination-out";
        ctx.rect(
            square.cornerA.x / LightHandler.zoomFactor,
            square.cornerA.y / LightHandler.zoomFactor,
            square.width / LightHandler.zoomFactor,
            square.width / LightHandler.zoomFactor);
        ctx.fill();
        // ctx.transform(1, 0, 0, 1, 0, 0);
    }
}