class Rebus extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })


    }

    connectedCallback() {

    }
    static get observedAttributes() {
        return ["markup", "css"]
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        fetch(newVal).then(response => response.text())
            .then(response => {

                if (attrName === "markup") {

                    let styles = this.shadow.innerHTML.split("<style>").length === 1 ?
                        "" : this.shadow.innerHTML.split("<style>")[1].split("</style>")[0]

                    this.shadow.innerHTML = response + `<style> ${styles} </style>`;

                }
                if (attrName === "css") {
                    let html = this.shadow.innerHTML.split("<style>")

                    let end = html.length === 1 ? "" : html[1].split("</style>")[1]
                    this.shadow.innerHTML = html[0] + `<style> ${response}</style>` + end
                }
            })
            .then(() => this.getData())
    }
    showQuestion  (levelData) {
        
        this.answer = levelData.text
        this.image.src = levelData.img;
        this.input.value = '';
        const letters = this.prepareButtons(levelData.text);

        this.buttons.innerHTML = "";
        letters.forEach(letter => {
            const btn = document.createElement("button");
            btn.textContent = letter.toLowerCase();
            this.buttons.appendChild(btn);
            btn.onclick = function(event) {
                // btn.remove()
                this.input.value += event.target.textContent
            }.bind(this)
        });
        
    }

    async getData() {
        this.currentQuestion = 0
        this.image = this.shadow.querySelector("#image");
        this.input = this.shadow.querySelector("#inputext");
        this.buttons = this.shadow.querySelector("#variant");
        this.checkButton = this.shadow.querySelector("#check");
        this.clean = this.shadow.querySelector("#clean");
        this.skip = this.shadow.querySelector("#skip");
        this.back = this.shadow.querySelector("#back");
        this.closeButton = this.shadow.querySelector("#myBtn");
        this.errorSpace = this.shadow.querySelector("#error")
        

        let rebusData = await (await fetch("https://fea13-sema.glitch.me/games")).json();

        this.showQuestion(rebusData[this.currentQuestion]);

        this.checkButton.onclick = function(event) {
                checkResult(this.input.value);
        }.bind(this)
            document.addEventListener("keypress", event => {
                
                if (event.key == "Enter") {
                    checkResult(this.input.value);
                }
            });
            this.clean.onclick = function(event){
                console.log("work")
                this.input.value = "";
                    
                    

                }.bind(this)
        
        let checkResult = function () {
          
            let inputdata = this.input.value.replace(/\s/g, '');

            if (inputdata !== this.answer) {
                this.errorSpace.style.display ="inline"
                return;
            }
            if (inputdata == this.answer) {
                this.showQuestion(rebusData[++this.currentQuestion])
                this.errorSpace.style.display ="none"
                return;
            }
            
            if ( this.currentQuestion >= rebusData.length-1) {
                this.shadow.querySelector(".foto").innerHTML = '<h1>Все ребусы успешно отгаданы, молодец!</h1>';
                return;
            }
            
                this.showQuestion(rebusData[++this.currentQuestion])
             
           
        }.bind(this) 
        

    };




    prepareButtons(text) {
        
        const letters = text.split("");
        letters.forEach(function (item, index, arr) {
            let randomNumber = num => Math.round(Math.random() * num);
            arr.push(String.fromCharCode(1040 + randomNumber(63)));
            let num = Math.round(Math.random() * (arr.length - 1));
            [arr[index], arr[num]] = [arr[num], arr[index]];
        });

        return letters;
    }


}
customElements.define("rebus-game", Rebus)
