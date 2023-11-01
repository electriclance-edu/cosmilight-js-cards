class EffectHandler {
    static spawnSwish(rotation,size) {
        let layer = document.getElementById("EffectLayer");
        let swish = document.createElement("div");
        swish.classList.add("effect-swish");
        swish.style = `
            --rotation:-${rotation}deg;
            --unit-width:${size * 2};
        `;
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