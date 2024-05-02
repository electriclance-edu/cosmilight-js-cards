class EffectHandler {
    static effects = [

    ];
    static canvases;
    static canvasCenter;
    static zoomFactor = 5;

    static initialize() {
        var canvases = document.getElementsByClassName("EffectCanvas");
        canvases = Array.from(canvases);
        canvases.forEach((canvas)=>{
            canvas.width = window.innerWidth / EffectHandler.zoomFactor;
            canvas.height = window.innerHeight / EffectHandler.zoomFactor;
        });
        EffectHandler.canvases = canvases;
        // EffectHandler.addEffect(new Effect({
        //     lifespan:30000000,
        //     startPt: new Point(0,0), linearAngle:45, displacement:250,
        //     // startPt:new Point(0,0), endPt:new Point(200,200),
        //     startSize:10, endSize:30,
        //     startOpacity:1, endOpacity:1
        // }));
        // EffectHandler.addEffect(new Effect({
        //     lifespan:300000,
        //     startPt:new Point(1,1), 
        //     linearAngle:randInt(360), 
        //     displacement:1,
        //     // startPt:mpos, endPt:new Point(0,0),
        //     startSize:10, endSize:30,
        //     startOpacity:randFloat(0.1), endOpacity:randFloat(0.2),
        //     spinSpeed:5,
        //     lightPointProperties:{
        //         strength:1,
        //         waver:0.01,
        //         color:new RGBA(255,0,0,1),
        //         faintness:1
        //     }
        // }));

        EffectHandler.render();
    }
    static addEffect(effect) {
        EffectHandler.effects.push(effect);
    }
    static clearCanvas(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.save();
        // let data = ctx.getImageData(0,0,canvas.width,canvas.height);
        // ctx.globalAlpha = 0.1;
        // ctx.putImageData(data,0,0);
        // ctx.restore();
    }
    static render() {
        const perceivedFrame = Math.floor(GUIHandler.frame / 1);
        let mpos = Point.translate(mousePosition,ScreenCenter);
        mpos.x *= -1;
        mpos.y *= -1;
        if (perceivedFrame % 300 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:randInt(1000) + 1000,
                startPt:new Point(
                    randInt(window.innerWidth) - window.innerWidth/2,
                    randInt(window.innerHeight) - window.innerHeight/2
                ), 
                linearAngle:randInt(360), 
                displacement:randInt(500),
                // startPt:mpos, endPt:new Point(0,0),
                startSize:1, endSize:3,
                startOpacity:randFloat(0.05), endOpacity:randFloat(0.2),
                spinSpeed:5,
                lightPointProperties:{
                    strength:randFloat(10) + 10,
                    waver:0.1,
                    color:new RGBA(255,255,255,0.1),
                    faintness:1//randFloat(0.3)
                }
            }));
        }
        if (perceivedFrame % 500 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:randInt(1000) + 1000,
                startPt:new Point(
                    randInt(window.innerWidth) - window.innerWidth/2,
                    randInt(window.innerHeight) - window.innerHeight/2
                ), 
                linearAngle:randInt(360), 
                displacement:randInt(100),
                // startPt:mpos, endPt:new Point(0,0),
                startSize:200, endSize:0,
                startOpacity:0, endOpacity:0,
                spinSpeed:5,
                lightPointProperties:{
                    strength:randInt(300) + 100,
                    waver:0.1,
                    faintness:0.5//randFloat(0.3)
                }
            }));
        }
        if (perceivedFrame % 500 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:randInt(100) + 100,
                startPt:new Point(
                    randInt(window.innerWidth) - window.innerWidth/2,
                    randInt(window.innerHeight) - window.innerHeight/2
                ), 
                linearAngle:randInt(360), 
                displacement:600,
                // startPt:mpos, endPt:new Point(0,0),
                startSize:0, endSize:2,
                startOpacity:0.3, endOpacity:0,
                spinSpeed:5,
                lightPointProperties:{
                    strength:randFloat(5) + 5,
                    waver:0.1,
                    color:new RGBA(255,255,255,0.01),
                    faintness:0.1//randFloat(0.3)
                }
            }));
        }
        if (perceivedFrame % 50 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:randInt(1000) + 1000,
                startPt:new Point(
                    randInt(window.innerWidth) - window.innerWidth/2,
                    randInt(window.innerHeight) - window.innerHeight/2
                ), 
                linearAngle:randInt(360), 
                displacement:randInt(100),
                // startPt:mpos, endPt:new Point(0,0),
                startSize:1, endSize:3,
                startOpacity:randFloat(0.001), endOpacity:randFloat(0.01),
                spinSpeed:5,
                lightPointProperties:{
                    strength:randFloat(5) + 5,
                    waver:0.1,
                    color:new RGBA(255,255,255,0.01),
                    faintness:0.1//randFloat(0.3)
                }
            }));
        }
        if (perceivedFrame % 100 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:randInt(1000) + 1000,
                startPt:new Point(
                    randInt(window.innerWidth) - window.innerWidth/2,
                    randInt(window.innerHeight) - window.innerHeight/2
                ), 
                linearAngle:randInt(360), 
                displacement:randInt(100),
                // startPt:mpos, endPt:new Point(0,0),
                startSize:1, endSize:3,
                startOpacity:randFloat(0.05), endOpacity:randFloat(0.1),
                spinSpeed:5,
                lightPointProperties:{
                    strength:randFloat(10) + 10,
                    waver:0.1,
                    color:new RGBA(255,255,255,0.01),
                    faintness:0.5//randFloat(0.3)
                }
            }));
        }
        let canvas = EffectHandler.canvases[perceivedFrame % EffectHandler.canvases.length];
        let ctx = canvas.getContext("2d")
        ctx.shadowColor = "rgba(255,255,255,1)";
        ctx.shadowBlur = 10 / EffectHandler.zoomFactor;

        EffectHandler.clearCanvas(canvas);

        const repeatRenders = 3;

        for (var i = 0; i < EffectHandler.effects.length; i++) {
            let effect = EffectHandler.effects[i];

            for (var j = 0; j < repeatRenders; j++) {
                // Update effect
                effect.lifetime += 1 / repeatRenders;

                if (effect.lifetime < 0) {
                    continue;
                }

                effect.size = effect.getSizeAtLifetime(effect.lifetime);
                effect.opacity = effect.getOpacityAtLifetime(Math.pow(effect.lifetime / effect.lifespan,Math.E) * effect.lifespan);
                effect.pos = effect.getPosAtLifetime(Math.pow(effect.lifetime / effect.lifespan,Math.E / 6) * effect.lifespan);
                if (effect.lifetime >= effect.lifespan) {
                    if (effect.lightPoint) LightHandler.removeLight(`effect${effect.id}`);
                    EffectHandler.effects.splice(i,1);
                    break;
                }
    
                // Render
                var topLeftPos = Point.translate(ScreenCenter,effect.pos);
    
                ctx.beginPath();
                ctx.fillStyle = `rgba(${effect.color.r},${effect.color.g},${effect.color.b},${effect.opacity})`;
                ctx.arc(
                    topLeftPos.x / EffectHandler.zoomFactor,
                    topLeftPos.y / EffectHandler.zoomFactor,
                    effect.size / EffectHandler.zoomFactor,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
                ctx.closePath();

                if (effect.lightPoint) {
                    LightHandler.moveLight(
                        `effect${effect.id}`,
                        -effect.pos.x,
                        effect.pos.y
                    );
                }
            }
        };
    }
}