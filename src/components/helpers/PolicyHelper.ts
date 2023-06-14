
export type TPolicyAction = {
    action: 'block_page' | 'block_paste' | 'disclaimer' | 'sticky' | 'none' | 'block_copy' | 'block_cut' | 'block_rightclick' | string
    message: TPolicyMessage
}

export type TPolicySummary = {
    resourceGroups: any,
    policy: Map<string, Map<string, TPolicyMessage>>,
}

export type TPolicyMessage = {
    title?: string,
    description: string,
    location: string,
    alertType: 'danger' | 'warning' | 'info' | 'success' | 'none',
    durationInSeconds: number
}

export const policyValidator = (url: string, configurationMap: Map<string, Map<string, TPolicyMessage>>,
    disclaimerAcceptanceStore: Map<string, Date>, stickyCancellationStore: Map<string, Date>, resourceGroupMap: Map<string, any>
): Array<TPolicyAction> => {
    let policyAction: TPolicyAction;

    let policyActions: Array<TPolicyAction> = [];
    console.log("configurationMap", configurationMap);
    for (const [key, value] of Object.entries(configurationMap) as Array<[string, Map<string, TPolicyMessage>]>) {
        const regex = new RegExp(key)
        if (regex.test(url) || configurationMap.has("<all_urls>")) {
            for (const [key, messageProps] of Object.entries(value)) {
                let domain = (new URL(url));

                if (key === 'disclaimer' && disclaimerAcceptanceStore.has(domain.hostname)) {
                    const storeDate = disclaimerAcceptanceStore.get(domain.hostname);
                    if (storeDate > new Date()) {
                        console.log("greater");
                        continue;
                    } else {
                        console.log("not greater");
                        disclaimerAcceptanceStore.delete(domain.hostname)
                    }
                }
                if (key === 'sticky' && stickyCancellationStore.has(domain.hostname)) {
                    const storeDate = stickyCancellationStore.get(domain.hostname);
                    if (storeDate > new Date()) {
                        console.log("greater");
                        continue;
                    } else {
                        console.log("not greater");
                        stickyCancellationStore.delete(domain.hostname)
                    }
                }
                let skipSinceExcludeGroup = false;
                if (messageProps.resources_exclude) {
                    const excludeList = messageProps.resources_exclude as Array<string>;
                    for (let groupName of excludeList) {
                        const resourceUrls = resourceGroupMap[groupName];
                        for (let urlObject of resourceUrls) {
                            let urlKey = urlObject["url"];
                            const regexExclude = new RegExp(urlKey);
                            if (regexExclude.test(url)) {
                                skipSinceExcludeGroup = true;
                                break;
                            }
                        }
                        if (skipSinceExcludeGroup) {
                            break;
                        }
                    }
                    if (skipSinceExcludeGroup) {
                        continue;
                    }
                }

                policyAction = {
                    action: key,
                    message: messageProps.message
                }
                policyActions.push(policyAction);
            }
            break;
        }
    }
    console.log("policy applicable count", policyActions.length);
    return policyActions;
}

export const policyParser = (rawData: JSON): TPolicySummary => {
    let resourceGroupMap = {};
    for (let resourceIndex in rawData['resource_groups']) {
        for (let key in rawData['resource_groups'][resourceIndex]) {
            resourceGroupMap[key] = rawData['resource_groups'][resourceIndex][key];
        }
    }
    let finalURLExportMap = new Map<string, Map<string, TPolicyMessage>>();
    for (let condition of rawData['conditions']) {
        for (let resourceGroup of condition['resources_include']) {
            for (let urlObject of resourceGroupMap[resourceGroup]) {
                let url = urlObject["url"];
                if (!finalURLExportMap[url]) {
                    finalURLExportMap[url] = new Map<string, TPolicyMessage>();
                }
                finalURLExportMap[url][condition["action"]] = condition["props"];
                if (condition['resources_exclude']) {
                    finalURLExportMap[url][condition["action"]]['resources_exclude'] = condition['resources_exclude'];
                }
            }
        }
    }
    let resourceGroups: TPolicySummary = {
        policy: finalURLExportMap,
        resourceGroups: resourceGroupMap
    }
    return resourceGroups;
}