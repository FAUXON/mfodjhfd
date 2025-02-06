document.addEventListener("DOMContentLoaded", function () {
    const boostAvisDiv = document.querySelector(".boostAvis");
    const tokens = ["TRC20", "ERC20", "SOL", "BNB"];
    const avisElements = [];

    function generateRandomHex(length) {
        let result = '';
        const characters = '0123456789abcdef';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function generateRandomAlphanumeric(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function generateAvis() {
        const tokenType = tokens[Math.floor(Math.random() * tokens.length)];
        let address = '';

        switch (tokenType) {
            case "ERC20":
                address = `0x${generateRandomHex(40)}`;
                break;
            case "TRC20":
                address = `T${generateRandomAlphanumeric(33)}`;
                break;
            case "SOL":
                address = generateRandomAlphanumeric(44);
                break;
            case "BNB":
                address = `0xe${generateRandomAlphanumeric(39)}`;
                break;
        }

        return {
            id: address,
            description: `1H x ${Math.floor(Math.random() * 24) + 1}`,
            type: tokenType,
            time: `1H x ${Math.floor(Math.random() * 24) + 1}`
        };
    }

    function abbreviateAddress(address) {
        return address.slice(0, 6) + "…" + address.slice(-4);
    }

    function createAvisElement() {
        const avisElement = document.createElement("div");
        avisElement.classList.add("avis");

        const avisId = document.createElement("span");
        avisId.classList.add("avis-id");

        const avisDescription = document.createElement("span");
        avisDescription.classList.add("avis-description");

        const avisType = document.createElement("span");
        avisType.classList.add("avis-type");

        const avisTime = document.createElement("span");
        avisTime.classList.add("avis-time");

        avisElement.appendChild(avisId);
        avisElement.appendChild(avisDescription);
        avisElement.appendChild(avisType);
        avisElement.appendChild(avisTime);

        boostAvisDiv.appendChild(avisElement);
        return { element: avisElement, id: avisId, description: avisDescription, type: avisType, time: avisTime };
    }

    function updateAvis() {
        avisElements.forEach(avis => {
            const newAvis = generateAvis();
            avis.id.textContent = abbreviateAddress(newAvis.id);
            avis.description.textContent = newAvis.description;
            avis.type.textContent = newAvis.type;
            avis.time.textContent = newAvis.time;

            avis.element.classList.remove("trc20", "erc20", "sol", "bnb");
            avis.element.classList.add(newAvis.type.toLowerCase());
        });
    }

    for (let i = 0; i < 100; i++) {
        avisElements.push(createAvisElement());
    }

    setInterval(updateAvis, 3000);
});
