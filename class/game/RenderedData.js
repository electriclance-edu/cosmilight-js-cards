// All data that is rendered on screen must implement the interface RenderedData for easy management of DOM updates

// Represents a piece of data that is
// associated with an element in the DOM
// and whose style updates according to the data
class RenderedData {
    generateElem() {};
    getRenderedElem() {};
    updateElem() {};
    resetElem() {};
}