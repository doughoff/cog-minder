// Common Jquery related code
import "bootstrap";
import * as jQuery from "jquery";

import { PageType, Spoiler, pageTypes } from "../types/commonTypes";
import { createItemDataContent, escapeHtml, getItem, itemData, valueOrDefault } from "./common";

const $ = jQuery.noConflict();

type HeaderInfo = {
    name: string;
    pageName: string;
    helpText: string | undefined;
    spoilers: boolean;
    beta11Check: boolean;
};

const headerLookup: Record<PageType, HeaderInfo> = {
    About: {
        name: "About",
        pageName: "about.html",
        helpText: undefined,
        spoilers: false,
        beta11Check: false,
    },
    Bots: {
        name: "Bots",
        pageName: "bots.html",
        helpText:
            "A robot reference. This page contains a (should be) complete reference of " +
            "known bot information (parts, resistances, and other special stats) along with some basic search " +
            "filters. Bot names can be clicked to display bot information in a popup, and part names inside " +
            "of those popups can be clicked to display another part info popup.",
        spoilers: true,
        beta11Check: true,
    },
    Build: {
        name: "Build",
        pageName: "build.html",
        helpText:
            "A build creator/planner. Allows for creating a build loadout and view some detailed stats " +
            "like the ones that are shown in-game. Some overall build summary stats are always shown up at " +
            'the top, while more individual part stats are available through the "Part Info" buttons. ' +
            "All stats are updated whenever any part is added, removed, or modified.",
        spoilers: true,
        beta11Check: true,
    },
    Combat: {
        name: "Combat",
        pageName: "combat.html",
        helpText:
            "A combat log analyzer. Combat logs from Beta 13 runs can be uploaded and analyzed to display " +
            "a breakdown of damage dealt and taken from different sources.",
        spoilers: false,
        beta11Check: false,
    },
    Hacks: {
        name: "Hacks",
        pageName: "hacks.html",
        helpText:
            "A machine hacking reference. Lists all available hacks for each type of machine as well " +
            "as their success rates. Entering hackware bonuses or other modifiers will update the odds " +
            "of each hack.",
        spoilers: true,
        beta11Check: false,
    },
    Lore: {
        name: "Lore",
        pageName: "lore.html",
        helpText: "A lore reference. Lists all lore entries in the game and allows searching for specific entries.",
        spoilers: true,
        beta11Check: false,
    },
    Parts: {
        name: "Parts",
        pageName: "parts.html",
        helpText:
            "A parts reference. This page lists the stats of all known parts in Cogmind. Most parts " +
            "come directly from the in-game gallery export, and the remainder (usually enemy-unique " +
            "unequippable parts) are manually entered. There are many ways to sort and filter the parts, " +
            "as well as three ways to view and compare the parts (info popup, part-to-part comparison, " +
            "and spreadsheet).",
        spoilers: true,
        beta11Check: true,
    },
    RIF: {
        name: "RIF",
        pageName: "rif.html",
        helpText:
            "A RIF ability and bothacking reference. This page lists all RIF abilities and their effects, " +
            "as well as all 0b10 hacks, their coupler charge usage, and effects.",
        spoilers: false,
        beta11Check: false,
    },
    Simulator: {
        name: "Simulator",
        pageName: "simulator.html",
        helpText:
            "A combat simulator. This page allows simulating a 1-on-1 combat with any bot in the game " +
            "with a given offensive loadout. Select an enemy, weapons, and any number of other various " +
            "combat-related utilities/stats, and then hit the Simulate button to kick off the simulator. " +
            "once complete, a graph of the number of volleys to kill is shown. Multiple simulations can be " +
            'compared by giving each dataset a name and clicking the "Add to comparison" button.',
        spoilers: true,
        beta11Check: true,
    },
    Wiki: {
        name: "Wiki",
        pageName: "wiki.html",
        helpText: "A wiki.",
        spoilers: true,
        beta11Check: false,
    },
};

// Creates the header for a given page
export function createHeader(page: PageType, headerContainer: JQuery<HTMLElement>): void {
    const info = headerLookup[page];

    const buttonsHtml = pageTypes
        .map((pageType) => {
            const info = headerLookup[pageType];

            if (page === pageType) {
                return `<a href="${info.pageName}" class="btn btn-current-page">${info.name}</a>`;
            } else {
                return `<a href="${info.pageName}" class="btn">${info.name}</a>`;
            }
        })
        .join("");

    let spoilerHtml: string;
    if (info.spoilers) {
        spoilerHtml = `
<div class="d-flex align-self-center justify-content-center">
    <div class="spoilers-group btn-group">
        <div class="input-group-prepend" data-toggle="tooltip" title="What spoiler content to show.">
            <span class="input-group-text">Spoilers</span>
        </div>
        <button id="spoilers" class="btn btn-flex dropdown-toggle" type="button" data-toggle="dropdown">
            None
        </button>
        <div id="spoilerDropdown" class="dropdown-menu">
            <button class="dropdown-item" data-toggle="tooltip"
                title="No spoilers: Factory or higher depth branch content is hidden.">None</button>
            <button class="dropdown-item" data-toggle="tooltip"
                title="Moderate spoilers: Normal Factory and Research branch content is shown.">Spoiler</button>
            <button class="dropdown-item" data-toggle="tooltip"
                title="Full spoilers: All game content is shown.">Redacted</button>
        </div>
    </div>`;

        // Reinstate for beta 12
        // if (info.beta11Check) {
        if (false) {
            spoilerHtml += `
    <label class="align-self-center ml-2" style="margin-bottom: 0;" data-toggle="tooltip"
        title="Enable or disable experimental Beta 11 part changes.">
        <input id="beta11Checkbox" type="checkbox">Beta 11</input>
    </label>
        `;
        }

        spoilerHtml += `
</div>`;
    } else {
        spoilerHtml = "<div></div>";
    }

    const helpLabel =
        info.helpText === undefined
            ? ""
            : `<span class="input-group-text-block display-6" data-toggle="tooltip" title="${escapeHtml(
                  info.helpText,
              )}">?</span>`;

    headerContainer.append(`
<div class="title-grid mt-2">
    <div class="header d-flex align-items-center justify-content-center">
        <span class="display-6">Cog-Minder</span>
    </div>
    <h1 class="display-5 text-center title">${info.name} ${helpLabel}</h1>
    ${spoilerHtml}
</div>
<div class="mb-2 menu-buttons-grid">
    ${buttonsHtml}
</div>
    `);

    if (info.spoilers) {
        // Load spoilers saved state
        $("#spoilers").text(getSpoilerState());
    }

    (headerContainer.find('[data-toggle="popover"]') as any).popover();
}

// Enables nested bot info popovers given a selector to the root bot popover
export function enablePopoverBotInfoInteraction(selector: JQuery<HTMLElement>): void {
    selector.on("shown.bs.popover", (e) => {
        const body = $(`#${$(e.target).attr("aria-describedby")}`).children(".popover-body");
        enableBotInfoInteraction(body);
    });

    selector.on("hide.bs.popover", (e) => {
        // Dispose nested popovers when the base popover is closed
        const body = $(`#${$(e.target).attr("aria-describedby")}`).children(".popover-body");
        disableBotInfoInteraction(body);
    });
}

const nameRegex = /\[([\w. '"\-/]*) \(\d/;
const optionNameRegex = /([\w. '"\-/]*) \(\d/;
// Enables bot info popovers given a selector to the root object
export function enableBotInfoInteraction(root: JQuery<HTMLElement>): void {
    // Set up popovers for items on bots
    const items = root.find(".details-part");
    items.each((_, element) => {
        const selector = $(element);
        const result = nameRegex.exec(selector.text());
        if (result === null || !(result[1] in itemData)) {
            // Not a valid item
            return;
        }

        // Set up popover attributes
        const weapon = getItem(result[1]);
        selector.data("html", true);
        selector.data("content", createItemDataContent(weapon));
        selector.addClass("bot-popover-item");
        (selector as any).popover();

        // Show/hide surrounding brackets to indicate selection
        selector.on("mouseenter", () => {
            selector.children("span").removeClass("bot-popover-item-bracket-invisible");
        });
        selector.on("mouseleave", () => {
            selector.children("span").addClass("bot-popover-item-bracket-invisible");
        });
    });

    const optionItems = root.find(".details-option").parent();
    optionItems.each((_, element) => {
        const selector = $(element);
        const result = optionNameRegex.exec(selector.find("span:nth-child(3)").text());
        if (result === null || !(result[1] in itemData)) {
            // Not a valid item
            return;
        }

        // Set up popover attributes
        const weapon = getItem(result[1]);
        selector.data("html", true);
        selector.data("content", createItemDataContent(weapon));
        selector.data("toggle", "popover");
        selector.addClass("bot-popover-item");
        (selector as any).popover();

        // Show/hide surrounding brackets to indicate selection
        selector.on("mouseenter", () => {
            selector.children(".bot-popover-item-bracket").removeClass("bot-popover-item-bracket-invisible");
        });
        selector.on("mouseleave", () => {
            selector.children(".bot-popover-item-bracket").addClass("bot-popover-item-bracket-invisible");
        });

        selector.data("toggle", "popover");
    });
}

// Disposes of all bot info popovers given a root object
export function disableBotInfoInteraction(root: JQuery<HTMLElement>): void {
    const items = root.find(".bot-popover-item");
    (items as any).popover("dispose");
}

// Gets the stored B11 state
export function getB11State(): boolean {
    // return window.localStorage.getItem("b11") === "true";
    // Reinstate for beta 12
    return false;
}

// Gets the ID of the selected button in a button group
export function getSelectedButtonId(selector: JQuery<HTMLElement>): string {
    return selector.children(".active").attr("id") as string;
}

// Gets the stored spoilers state
export function getSpoilerState(): Spoiler {
    let value = valueOrDefault(window.localStorage.getItem("spoilers"), "None");
    if (value === "Spoilers") {
        value = "Spoiler";
    }

    if (value?.charAt(0) === '"') {
        value = value.slice(1, value.length - 1);
    }

    if (typeof value != "string" || (value != "None" && value != "Spoiler" && value != "Redacted")) {
        value = "None";
    }

    return value as Spoiler;
}

// Registers a function on the document to disable autocomplete for all inputs
export function registerDisableAutocomplete(document: JQuery<Document>): void {
    document.on("focus", ":input", (e) => {
        $(e.target).attr("autocomplete", "off");
    });
}

export function refreshSelectpicker(selector: JQuery<HTMLElement>): void {
    selector.selectpicker("refresh");

    // Minor hack, the btn-light class is auto-added to dropdowns with search
    // but it doesn't really fit with everything else
    selector.next().removeClass("btn-light");
}

// Clears a button group's state and sets the first item to be active
export function resetButtonGroup(group: JQuery<HTMLElement>): void {
    group.children().removeClass("active");
    group.find("input").prop("checked", false);

    group.children("label:first-of-type").addClass("active");
    group.children("label:first-of-type > input").prop("checked", true);
}

// Clears a button group's state and sets the item at the selected index to be active
export function setActiveButtonGroupButton(group: JQuery<HTMLElement>, index: number): void {
    group.children().removeClass("active");
    group.find("input").prop("checked", false);

    group.children(`label:nth-of-type(${index})`).addClass("active");
    group.children(`label:nth-of-type(${index}) > input`).prop("checked", true);
}

// Sets the stored spoiler state
export function setSpoilerState(state: string): void {
    window.localStorage.setItem("spoilers", '"' + state + '"');
}

// Sets the stored b11 state
export function setB11State(state: boolean): void {
    return window.localStorage.setItem("b11", state.toString());
}

// Temporarily set the text value of a selector for the specified timeout
export function temporarilySetValue(
    selector: JQuery<HTMLElement>,
    newValue: string,
    initialValue: string,
    time: number,
    maintainWidth = false,
): void {
    const currentWidth = selector.width()!;
    selector.text(newValue);

    if (maintainWidth) {
        selector.width(currentWidth);
    }

    setTimeout(() => {
        if (maintainWidth) {
            selector.width("");
        }
        selector.text(initialValue);
    }, time);
}
