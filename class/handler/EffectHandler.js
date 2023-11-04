class EffectHandler {
    static swishDirection = false;
    static spawnSwish(rotation,size,clockwise = EffectHandler.swishDirection) {
        EffectHandler.swishDirection = !EffectHandler.swishDirection;
        
        let layer = document.getElementById("EffectLayer");
        let swish = document.createElement("div");
        swish.classList.add("effect-swish");

        if (clockwise) {
            swish.style = `
                --starting-rotation:${-rotation - 30}deg;
                --final-rotation:${-rotation + 30}deg;
                --unit-width:${size * 2};
                --x:${randInt(20) * randSign()}px;
                --y:${randInt(20) * randSign()}px;
            `;
        } else {
            swish.style = `
                --starting-rotation:${-rotation + 30}deg;
                --final-rotation:${-rotation - 30}deg;
                --unit-width:${size * 1.5};
                --x:${randInt(20) * randSign()}px;
                --y:${randInt(20) * randSign()}px;
            `;
        }
        layer.appendChild(swish);
        setTimeout(()=>{
            swish.remove();
        },600);
    }
    static spawnBullet(origin,end,initRad,endRad) {
        let layer = document.getElementById("EffectLayer");
        let bullet = document.createElement("div");
        bullet.classList.add("effect-bullet");
        bullet.style = `
            --start-x:${origin.x * tileWidth}px;
            --start-y:${origin.y * tileHeight}px;
            --end-x:${end.x * tileWidth}px;
            --end-y:${end.y * tileHeight}px;
            --init-radius:${initRad * tileWidth}px;
            --end-radius:${endRad * tileWidth}px;
        `;
        layer.appendChild(bullet);
        setTimeout(()=>{
            bullet.remove();
        },600);
    }
}