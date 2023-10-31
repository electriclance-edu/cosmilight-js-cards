class EffectHandler {
    static spawnSwish(rotation) {
        let layer = document.getElementById("EffectLayer");
        let swish = document.createElement("div");
        swish.classList.add("effect-swish");
        swish.style = `--rotation:-${rotation}deg`;
        layer.appendChild(swish);
        setTimeout(()=>{
            swish.remove();
        },600);
    }
}