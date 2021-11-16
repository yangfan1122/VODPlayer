import {G} from "../../../../G";
import {D} from "../../../../D";
import {Model} from "../model/Model";
/**
 * Created by Administrator on 2017/6/21.
 */
export class UI {
    private dataIdHeader:string = "";
    private container:HTMLDivElement;
    private model:Model;

    public constructor(container:HTMLDivElement, m:Model) {
        this.model = m;
        this.container = container;
        this.dataIdHeader = container.id+"_";

        //控制栏
        const vodCtrlContainer:HTMLDivElement = this.div("vodCtrlContainer", "vodCtrlContainer");

        //进度条
        const vodProgressBar:HTMLDivElement = this.div("vodProgressBar vodplayerdiv", "vodProgressBar");
        const vodSlider:HTMLDivElement = this.div("vodSlider", "vodSlider");
        const vodBars:HTMLDivElement = this.div("vodBars", "vodBars");
        const vodProgressBg:HTMLDivElement = this.div("vodProgressBg vodplayerdiv");
        const vodLoadingBar:HTMLDivElement = this.div("vodLoadingBar vodplayerdiv", "vodLoadingBar");
        const vodPlayingBar:HTMLDivElement = this.div("vodPlayingBar vodplayerdiv", "vodPlayingBar");
        const vodFocusBarContainer:HTMLDivElement = this.div("vodFocusBarContainer", "vodFocusBarContainer");
        vodBars.appendChild(vodProgressBg);
        vodBars.appendChild(vodLoadingBar);
        vodBars.appendChild(vodPlayingBar);
        vodBars.appendChild(vodFocusBarContainer);
        vodProgressBar.appendChild(vodSlider);
        vodProgressBar.appendChild(vodBars);

        //按钮
        const vodBtns:HTMLDivElement = this.div("vodBtns");
        const vodToggleContainer:HTMLDivElement = this.div("vodPlayBtn", "vodToggleContainer");
        const vodToggle:HTMLDivElement = this.div("vodPlayBtn", "vodToggle");
        vodToggleContainer.appendChild(vodToggle);
        const vodVolumeBtnContainer:HTMLDivElement = this.div("vodVolumeBtn", "vodVolumeBtnContainer");
        const vodVolumeBtn:HTMLDivElement = this.div("vodVolumeBtn", "vodVolumeBtn");
        vodVolumeBtnContainer.appendChild(vodVolumeBtn);
        const vodVolumeBar:HTMLDivElement = this.div("vodVolumeBar", "vodVolumeBar");
        const vodVolumeSlider:HTMLDivElement = this.div("vodVolumeSlider", "vodVolumeSlider");
        const vodVolumeBars:HTMLDivElement = this.div("vodVolumeBars", "vodVolumeBars");
        const vodVolumeBg:HTMLDivElement = this.div("vodVolumeBg");
        const vodVolumeMoving:HTMLDivElement = this.div("vodVolumeMoving", "vodVolumeMoving");
        const vodTime:HTMLDivElement = this.div("vodTime", "vodTime");
        vodVolumeBars.appendChild(vodVolumeBg);
        vodVolumeBars.appendChild(vodVolumeMoving);
        vodVolumeBar.appendChild(vodVolumeSlider);
        vodVolumeBar.appendChild(vodVolumeBars);
        vodVolumeBar.appendChild(vodTime);
        const vodCheckContainer:HTMLDivElement = this.div("vodCheckContainer", "vodCheckContainer");//审核平台版操作界面容器
        const vodSetting:HTMLDivElement = this.div("vodSetting", "vodSetting");
        const vodSettingBtn:HTMLDivElement = this.div("vodSetting", "vodSettingBtn");
        vodSetting.appendChild(vodSettingBtn);
        const vodQuality:HTMLDivElement = this.div("vodQuality", "vodQuality");
        const vodQualityBtn:HTMLDivElement = this.div("", "vodQualityBtn");
        vodQuality.appendChild(vodQualityBtn);
        const vodFull:HTMLDivElement = this.div("vodFull", "vodFull");
        const vodFullBtn:HTMLDivElement = this.div("vodFull vodFullBtn", "vodFullBtn");
        vodFull.appendChild(vodFullBtn);
        vodBtns.appendChild(vodToggleContainer);
        vodBtns.appendChild(vodVolumeBtnContainer);
        vodBtns.appendChild(vodVolumeBar);
        vodBtns.appendChild(vodCheckContainer);
        vodBtns.appendChild(vodSetting);
        vodBtns.appendChild(vodQuality);
        vodBtns.appendChild(vodFull);

        vodCtrlContainer.appendChild(vodProgressBar);
        vodCtrlContainer.appendChild(vodBtns);


        //video
        const vodVideoContainer:HTMLDivElement = this.div("vodVideoContainer", "vodVideoContainer");
        const vodTipsContainer:HTMLDivElement = this.div("vodTipsContainer", "vodTipsContainer");
        const vodCoverContainer:HTMLDivElement = this.div("vodCoverContainer", "vodCoverContainer");
        const vodLoading:HTMLDivElement = this.div("vodLoading", "vodLoading");
        const vodCanvasContainer:HTMLDivElement = this.div("", "vodCanvasContainer");
        const vodVRContainer:HTMLDivElement = this.div("", "vodVRContainer");
        const vodVideo:HTMLVideoElement = this.video("vodVideo", "vodVideo");
        vodVideoContainer.appendChild(vodTipsContainer);
        vodVideoContainer.appendChild(vodCoverContainer);
        vodVideoContainer.appendChild(vodLoading);
        vodVideoContainer.appendChild(vodCanvasContainer);
        vodVideoContainer.appendChild(vodVRContainer);
        vodVideoContainer.appendChild(vodVideo);


        //右键菜单
        const vodMenu:HTMLDivElement = this.div("vodMenu", "vodMenu");
        const vodMenuItem1:HTMLDivElement = this.div("");
        vodMenuItem1.style.display = "none";
        // const vodMenuItem1A:HTMLAnchorElement = this.anchor("#", "\u67e5\u770b\u65e5\u5fd7");//查看日志
        const vodMenuItem1A:HTMLAnchorElement = this.anchor("#", "View log");//查看日志
        vodMenuItem1.appendChild(vodMenuItem1A);
        const vodMenuItem2:HTMLDivElement = this.div("");
        const vodMenuItem2A:HTMLAnchorElement = this.anchor("https://github.com/yangfan1122/VODPlayer", "VODPlayer", "_blank");
        vodMenuItem2.appendChild(vodMenuItem2A);
        const vodMenuItem3:HTMLDivElement = this.div("");
        vodMenuItem3.innerHTML = G.version;
        vodMenu.appendChild(vodMenuItem1);
        vodMenu.appendChild(vodMenuItem2);
        // vodMenu.appendChild(vodMenuItem3);


        //设置
        const vodSettingPanel:HTMLDivElement = this.div("vodSettingPanel", "vodSettingPanel");
        const vodSettingPanelItem1:HTMLDivElement = this.div("");
        // vodSettingPanelItem1.innerHTML = "\u8bbe\u7f6e";//设置
        vodSettingPanelItem1.innerHTML = "Setting";//设置
        const vodSettingPanelLine:HTMLLIElement = document.createElement("li");
        vodSettingPanelLine.className = "vodSettingPanelLine";
        const vodSettingItems:HTMLDivElement = this.div("vodSettingItems", "vodSettingItems");
        const vodSpeedItem:HTMLDivElement = this.div("", "vodSpeedItem");
        // const vodSpeedItemSpan:HTMLSpanElement = this.span("\u901f\u5ea6");//速度
        const vodSpeedItemSpan:HTMLSpanElement = this.span("speed");//速度
        vodSpeedItem.appendChild(vodSpeedItemSpan);
        vodSettingItems.appendChild(vodSpeedItem);
        vodSettingPanel.appendChild(vodSettingPanelItem1);
        vodSettingPanel.appendChild(vodSettingPanelLine);
        vodSettingPanel.appendChild(vodSettingItems);


        //切换清晰度
        const vodQualityPanel:HTMLDivElement = this.div("vodQualityPanel", "vodQualityPanel");
        const vodQualityItems:HTMLDivElement = this.div("vodQualityItems", "vodQualityItems");
        const vodHDItem:HTMLDivElement = this.div("", "vodHDItem");
        // const vodHDItemImg:HTMLImageElement = this.img("//raw.githubusercontent.com/yangfan1122/docs/gh-pages/assets/tick.png");
        const vodHDItemImg:HTMLImageElement = this.img("../../../../../style/tick.png");
        // const vodHDItemSpan:HTMLSpanElement = this.span("\u9ad8\u6e05");//高清
        const vodHDItemSpan:HTMLSpanElement = this.span("HD");//高清
        vodHDItem.appendChild(vodHDItemImg);
        vodHDItem.appendChild(vodHDItemSpan);
        const vodSDItem:HTMLDivElement = this.div("", "vodSDItem");
        // const vodSDItemImg:HTMLImageElement = this.img("//raw.githubusercontent.com/yangfan1122/docs/gh-pages/assets/tick.png");
        const vodSDItemImg:HTMLImageElement = this.img("../../../../../style/tick.png");
        // const vodSDItemSpan:HTMLSpanElement = this.span("\u6d41\u7545");//流畅
        const vodSDItemSpan:HTMLSpanElement = this.span("SD");//流畅
        vodSDItem.appendChild(vodSDItemImg);
        vodSDItem.appendChild(vodSDItemSpan);
        vodQualityItems.appendChild(vodHDItem);
        vodQualityItems.appendChild(vodSDItem);
        vodQualityPanel.appendChild(vodQualityItems);


        //Alert
        const vodAlertPanel:HTMLDivElement = this.div("vodAlertPanel", "vodAlertPanel");


        //看点
        const vodFocusPanel:HTMLDivElement = this.div("vodFocusPanel", "vodFocusPanel");


        //播放速度面板
        const vodRatePanel:HTMLDivElement = this.div("vodRatePanel", "vodRatePanel");
        const vodRatePanelTitle:HTMLDivElement = this.div("vodRatePanelTitle");
        // vodRatePanelTitle.innerHTML = "\u64ad\u653e\u901f\u5ea6";//播放速度
        vodRatePanelTitle.innerHTML = "speed";//播放速度
        const vodRatePanelInputs:HTMLDivElement = this.div("");
        const vodRatePanelInput1:HTMLInputElement = this.input("radio", "1");
        const vodRatePanelInput2:HTMLInputElement = this.input("radio", "2");
        const vodRatePanelInput3:HTMLInputElement = this.input("radio", "3");
        vodRatePanelInputs.appendChild(vodRatePanelInput1);
        // vodRatePanelInputs.innerHTML += "\u9ed8\u8ba4";//默认
        vodRatePanelInputs.innerHTML += "Default";//默认
        vodRatePanelInputs.appendChild(vodRatePanelInput2);
        vodRatePanelInputs.innerHTML += "2x";
        vodRatePanelInputs.appendChild(vodRatePanelInput3);
        vodRatePanelInputs.innerHTML += "3x";
        const vodRatePanelClose:HTMLDivElement = this.div("vodRatePanelClose", "vodRatePanelClose");
        // vodRatePanelClose.innerHTML = "[\u5173\u95ed]";//关闭
        vodRatePanelClose.innerHTML = "[Close]";//关闭
        vodRatePanel.appendChild(vodRatePanelTitle);
        vodRatePanel.appendChild(vodRatePanelInputs);
        vodRatePanel.appendChild(vodRatePanelClose);

        this.model.u.removeChildren(this.container);
        this.container.appendChild(vodCtrlContainer);
        this.container.appendChild(vodVideoContainer);
        this.container.appendChild(vodMenu);
        this.container.appendChild(vodSettingPanel);
        this.container.appendChild(vodQualityPanel);
        this.container.appendChild(vodAlertPanel);
        this.container.appendChild(vodFocusPanel);
        this.container.appendChild(vodRatePanel);
    }

    public div(className:string, id?:string):HTMLDivElement {
        const div:HTMLDivElement = document.createElement("div");
        if(className.length > 0) {
            div.className = className;
        }
        if(id!==undefined) {
            div.id = this.dataIdHeader+id;
        }
        return div;
    }

    private video(className:string, id?:string):HTMLVideoElement {
        const v:HTMLVideoElement = document.createElement("video");
        if(className.length > 0) {
            v.className = className;
        }
        if(id!==undefined) {
            v.id = this.dataIdHeader+id;
        }
        return v;
    }

    private img(src:string):HTMLImageElement {
        const img:HTMLImageElement = document.createElement("img");
        img.src = src;
        return img;
    }

    private span(content:string):HTMLSpanElement {
        const s:HTMLSpanElement = document.createElement("span");
        s.innerHTML = content;
        return s;
    }

    private input(type:string, value:string):HTMLInputElement {
        const i:HTMLInputElement = document.createElement("input");
        i.type = type;
        i.value = value;
        return i;
    }

    private anchor(href:string, content:string, target?:string):HTMLAnchorElement {
        const a:HTMLAnchorElement = document.createElement("a");
        a.href = href;
        a.innerHTML = content;
        if(target !== undefined) {
            a.target = target;
        }
        return a;
    }
}
