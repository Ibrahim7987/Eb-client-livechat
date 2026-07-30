import axios from "axios";
import { load_livechat_widget } from "./widgetUtils";


(() => {

    var channel_ids: string[] = [];
    try {        
        var widgetContainers = document.querySelectorAll('[class^="engagebay-chat-widget"]');

        console.log("widgetContainers ", widgetContainers);

        Array.prototype.forEach.call(widgetContainers, function (element) {
            channel_ids.push(element.getAttribute("data-id"));
        });

        axios(
            "https://eb-webhooks.engagebay.com/channel/get-active-channel-by-ids?apiKey=" +
            (window as any).EhAccount.getKey() +
            "&channelIds=" +
            channel_ids.join(","), {}
        )
        .then((response: any) => {
            const channelData = response.data;
            if (!channelData || (!Array.isArray(channelData) && channelData.widget && !channelData.widget.chatEnabled))
                return;
            load_livechat_widget(channelData, !Array.isArray(channelData) && channelData.widget ? "legacy-chat" : "unified-inbox");
            
        })
        .catch((error) => {
            console.error("Error fetching channel prefs: ", error);
        });
    } catch (error) {
        console.error("Error initializing live chat widget: ", error);
    }

})();
