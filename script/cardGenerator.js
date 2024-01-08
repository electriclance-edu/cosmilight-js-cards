function cardGeneratorOnload() {
    DataHandler.loadAllData();

    document.body.appendChild(CardHandler.generateRawCardElement(new Card("debug_map").type));
}