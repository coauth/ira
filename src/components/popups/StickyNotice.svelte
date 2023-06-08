<script lang="ts">
    import type { TPolicyMessage } from "../helpers/PolicyHelper";
    import type { TAlertProps } from "../types/AlertPropsTypes";
    import AlertContent from "./AlertContent.svelte";

    export let props: TPolicyMessage;

    let position:string;
    if(props.location==='top'){
        position='top';
    }else{
        position='bottom';
    }
</script>

<div
    id="sticky-banner"
    tabindex="-1"
    class="fixed {position}-0 left-0 z-[1000] flex justify-between w-full p-0 shadow-md"
    style="display:block !important;"
>
    <AlertContent {props} />
</div>
