document.getElementById("toggleButton").addEventListener("click", function() {
    var text = document.querySelector(".toggle-text");
    
    if (text.classList.contains("hidden")) {
        text.classList.remove("hidden");
        text.classList.add("show");
        this.textContent = "Referências";
    } else {
        text.classList.remove("show");
        text.classList.add("hidden");
        this.textContent = "Referências";
    }
});