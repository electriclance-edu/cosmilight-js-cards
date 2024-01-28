class EffectHandler {
    static effects = [

    ];

    static canvases;
    static canvasCenter;
    static initialize() {
        var canvases = document.getElementsByClassName("EffectCanvas");
        canvases = Array.from(canvases);
        canvases.forEach((canvas)=>{
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        EffectHandler.canvases = canvases;
        EffectHandler.canvasCenter = new Point(window.innerWidth/2,window.innerHeight/2);

        EffectHandler.addEffect(new Effect({
            lifespan:30000000,
            startPt: new Point(0,0), linearAngle:45, displacement:250,
            // startPt:new Point(0,0), endPt:new Point(200,200),
            startSize:10, endSize:30,
            startOpacity:1, endOpacity:1
        }));

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
        let mpos = Point.translate(mousePosition,EffectHandler.canvasCenter);
        mpos.x *= -1;
        mpos.y *= -1;
        if (GUIHandler.frame % 50 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:100,
                // startPt:mpos, linearAngle:randInt(360), displacement:200 + randInt(100),
                startPt:mpos, endPt:new Point(0,0),
                startSize:10, endSize:30,
                startOpacity:0.5, endOpacity:0,
                spinSpeed:12
            }));
        }
        if (GUIHandler.frame % 10 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:60,
                startPt:mpos, 
                linearAngle:-angleBetween(mpos,new Point(0,0)) + randInt(60) - 30, 
                displacement:dist(mpos,new Point(0,0)) * (randFloat(0.3) + 0.85),
                // startPt:mpos, linearAngle:randInt(360), displacement:50 + randInt(50),
                // startPt:new Point(0,0), endPt:new Point(200,200),
                startSize:0, endSize:10 + randInt(10),
                startOpacity:0.5 * (randFloat(1) + 0.5), endOpacity:0,
            }));
        }
        if (GUIHandler.frame % 7 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:randInt(40) + 10,
                startPt:mpos, 
                linearAngle:-angleBetween(mpos,new Point(0,0)) + randInt(180) - 90, 
                displacement:50 + randInt(50),
                // startPt:new Point(0,0), endPt:new Point(200,200),
                startSize:5, endSize:10 + randInt(5),
                startOpacity:0.05, endOpacity:0,
                color:new RGBA(60,80,127.49999999999)
            }));
        }
        if (GUIHandler.frame % 5 == 0) {
            EffectHandler.addEffect(new Effect({
                lifespan:randInt(100) + 10,
                startPt:mpos, 
                linearAngle:-angleBetween(mpos,new Point(0,0)) + randInt(180) - 90, 
                displacement:50 + randInt(50),
                // startPt:new Point(0,0), endPt:new Point(200,200),
                startSize:5, endSize:50,
                startOpacity:0.005, endOpacity:0,
                color:new RGBA(60,80,127.49999999999)
            }));
        }
        let canvas = EffectHandler.canvases[GUIHandler.frame % EffectHandler.canvases.length];
        let ctx = canvas.getContext("2d")
        ctx.shadowColor = "rgba(255,255,255,1)";
        ctx.shadowBlur = 10;

        EffectHandler.clearCanvas(canvas);

        const repeatRenders = 3;

        for (var i = 0; i < EffectHandler.effects.length; i++) {
            let effect = EffectHandler.effects[i];

            for (var j = 0; j < repeatRenders; j++) {
                // Update effect
                effect.lifetime += 1 / repeatRenders;
                effect.size = effect.getSizeAtLifetime(effect.lifetime);
                effect.opacity = effect.getOpacityAtLifetime(Math.pow(effect.lifetime / effect.lifespan,Math.E) * effect.lifespan);
                effect.pos = effect.getPosAtLifetime(Math.pow(effect.lifetime / effect.lifespan,Math.E / 6) * effect.lifespan);
                if (effect.lifetime >= effect.lifespan) {
                    EffectHandler.effects.splice(i,1);
                }
    
                // Render
                var topLeftPos = Point.translate(EffectHandler.canvasCenter,effect.pos);
    
                ctx.beginPath();
                ctx.fillStyle = `rgba(${effect.color.r},${effect.color.g},${effect.color.b},${effect.opacity})`;
                ctx.arc(
                    topLeftPos.x,
                    topLeftPos.y,
                    effect.size,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
                ctx.closePath();
            }
        };
    }
}