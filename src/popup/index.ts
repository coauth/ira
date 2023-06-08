import Options from "src/components/Options.svelte";
import { storage } from "src/storage";
import browser from "webextension-polyfill";

const target = document.getElementById("app");

function render() {
    storage.get().then(({ count }) => {
        new Options({ target, props: { count } });
    });
}

//let image = "https://images.unsplash.com/photo-1586074299757-dc655f18518c?fit=crop&w=1268&q=80";


function change() {
    //browser.storage.local.set({ background: image });
    browser.storage.local.set({ background: "image" });
  }

document.addEventListener("DOMContentLoaded", render);
