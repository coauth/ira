
export type TPolicyAction = {
    action: 'block_page' | 'block_paste' | 'disclaimer' | 'sticky' | 'none' | 'block_copy' | 'block_cut' | 'block_rightclick' | string
    message:TPolicyMessage
}

export type TPolicyMessage = {
        title?: string,
        description:string,
        location: string,
        alertType: 'danger' | 'warning' | 'info' | 'success' |'none',
        durationInSeconds: number
}

export const policyValidator = (url: string,configurationMap:Map<string,Map<string,TPolicyMessage>>): Array<TPolicyAction> => {
    let policyAction: TPolicyAction;

    let policyActions:Array<TPolicyAction>=[];
    console.log("configurationMap",configurationMap);
    for (const [key, value] of Object.entries(configurationMap) as Array<[string,Map<string,TPolicyMessage>]>) {
        const regex = new  RegExp(key)
        if(regex.test(url)){
            for (const [key, messageProps] of Object.entries(value)) {
                policyAction={
                    action: key,
                    message:messageProps.message
                }
                policyActions.push(policyAction);
            }
            break;
        }
    }
    console.log("policy applicable count",policyActions.length);
    return policyActions;
}

export const policyParser = (rawData: JSON): Map<string, Map<string,TPolicyMessage>> => {
    let resourceGroupMap = {};
    for (let resourceIndex in rawData['resource_groups']) {
        for (let key in rawData['resource_groups'][resourceIndex]) {
            resourceGroupMap[key] = rawData['resource_groups'][resourceIndex][key];
        }
    }
    let finalURLExportMap = new Map<string,Map<string,TPolicyMessage>>();
    for (let condition of rawData['conditions']) {
        for (let resourceGroup of condition['resources']) {
            for (let urlObject of resourceGroupMap[resourceGroup]) {
                let url = urlObject["url"];
                if (!finalURLExportMap[url]) {
                    finalURLExportMap[url] = new Map<string,TPolicyMessage>();
                }
                finalURLExportMap[url][condition["action"]]=condition["props"];
            }
        }
    }
    return finalURLExportMap;
}