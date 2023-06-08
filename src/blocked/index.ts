import browser from "webextension-polyfill";

// Some global styles on the page
import "./styles.css";
import Blocked from "../components/Blocked.svelte";
import type { TMessageCategory } from "src/components/types/MessageCategoryTypes";


let askMessage:TMessageCategory={
    category:'REQUEST_MESSAGE'
}


  new Blocked({ target: document.body });



