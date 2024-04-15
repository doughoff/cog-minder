// Common code
import { Bot, BotPart } from "../botTypes";
import { MapLocation, Spoiler } from "../types/commonTypes";
import {
    BaseItem,
    Item,
    ItemRatingCategory,
    ItemType,
    PowerItem,
    PropulsionItem,
    SpecialPropertyTypeName,
    UtilityItem,
    WeaponItem,
} from "../types/itemTypes";

// A special bot name to image name map for special/unique bots
const botNameImageMap = new Map<string, string>([
    ["01-MTF", "Programmer"],
    ["12-ASH", "Grunt"],
    ["1C-UTU", "Duelist"],
    ["5H-AD0", "Hunter"],
    ["7R-MNS", "Grunt"],
    ["7V-RTL", "Sentry"],
    ["8R-AWN", "Grunt"],
    ["99-TNT", "Demolisher"],
    ["AD-0RF", "Fireman (Derelict)"],
    ["AZ-K3N", "Sentry"],
    ["A2", "Programmer"],
    ["A3", "Programmer"],
    ["A4", "Programmer"],
    ["A5", "Programmer"],
    ["A6", "Programmer"],
    ["A7", "Programmer"],
    ["A8", "Programmer"],
    ["Architect", "Architect"],
    ["Autobeam Turret", "Autobeam Turret"],
    ["Cobbler", "Mechanic"],
    ["CL-ANK", "Brawler"],
    ["Data Miner", "Data Miner"],
    ["EX-BIN", "Researcher"],
    ["EX-DEC", "Researcher"],
    ["EX-HEX", "Researcher"],
    ["HV-R5K", "Grunt"],
    ["God Mode", "God Mode"],
    ["God Mode (Fake)", "God Mode"],
    ["Imprinter", "Imprinter"],
    ["MAIN.C", "MAIN.C2"],
    ["MAIN.C (Shell)", "MAIN.C1"],
    ["ME-RLN", "Programmer"],
    ["NK-0LA", "Specialist"],
    ["Perun", "Perun"],
    ["P1-3CE", "Mutant (Derelict)"],
    ["Revision", "Revision"],
    ["Revision 17", "Revision 17"],
    ["Revision 17++", "Revision 17++"],
    ["Sigix Warrior", "Sigix Warrior"],
    ["Surveybot 24", "Researcher"],
    ["Svarog", "Svarog"],
    ["Master Thief", "Thief (Derelict)"],
    ["VL-GR5", "Specialist"],
    ["Warbot", "Mutant (Derelict)"],
    ["Warlord", "Warlord"],
    ["Warlord (Command)", "Warlord"],
    ["Warlord 4Z-XS3", "Warlord"],
    ["Warlord AM-PH4", "Warlord"],
    ["Warlord D3-CKR", "Warlord"],
    ["Warlord HL-1SK", "Warlord"],
    ["Warlord KY-Z71", "Warlord"],
    ["Warlord MG-163", "Warlord"],
    ["Warlord SH-K8T", "Warlord"],
    ["Warlord Statue", "Warlord"],
    ["YI-UF0", "Grunt"],
    ["Z-Courier", "Hauler"],
    ["Z-Imprinter", "Imprinter"],
    ["Z-Technician", "Operator"],
    ["Zhirov", "Zhirov"],
]);

// A list of items with no gallery art
export const itemsWithNoArt = new Set([
    "T-thruster",
    "Mak. Microthruster",
    "Integrated Tracker Drive",
    "Detonator",
    "Splice Injector",
    "Mni. Tearclaws",
    "DAS Cannon",
    "Compactor",
    "Asb. Blade",
    "Asb. F-torch",
    "Asb. Gauss Rifle",
    "Asb. Heavy Rifle",
    "Asb. Hover System",
    "Asb. Hover Unit",
    "Asb. Maul",
    "Asb. P-maul",
    "Asb. P-torch",
    "Asb. P-sword",
    "Asb. Rifle",
    "Asb. Shotgun",
    "Vortex Shredder",
    "Centrium Claws",
    "T.R.O.L.L. Exoskeleton",
]);

// Color schemes
enum ColorScheme {
    LowGood = "lowGood",
    HighGood = "highGood",
    Green = "green",
    Red = "red",
}
const colorSchemes = {
    lowGood: {
        low: "details-range-green",
        midLow: "details-range-yellow",
        midHigh: "details-range-orange",
        high: "details-range-red",
    },
    highGood: {
        low: "details-range-red",
        midLow: "details-range-orange",
        midHigh: "details-range-yellow",
        high: "details-range-green",
    },
    green: {
        low: "details-range-green",
        midLow: "details-range-green",
        midHigh: "details-range-green",
        high: "details-range-green",
    },
    red: {
        low: "details-range-red",
        midLow: "details-range-red",
        midHigh: "details-range-red",
        high: "details-range-red",
    },
};

// Character -> escape character map
export const entityMap: { [key: string]: string } = {
    "&": "&amp;",
    "<": "ᐸ",
    ">": "ᐳ",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
    "\n": "<br />",
};

export const rootDirectory = "/cog-minder/";

// Compile-time assert that code is unreachable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertUnreachable(val: never): never {
    throw new Error(`This should not be reachable: ${val}`);
}

// In the given string, bolds all matches of matchText
// Uses lowercase matching but returns modified text with proper capitalization
export function boldMatches(text: string, matchText: string): string {
    // Bold the match
    let searchIndex: number;
    let endSubstringIndex = Number.MAX_SAFE_INTEGER;
    while ((searchIndex = text.substring(0, endSubstringIndex).toLowerCase().lastIndexOf(matchText)) !== -1) {
        text =
            text.substring(0, searchIndex) +
            `<b>${text.substring(searchIndex, searchIndex + matchText.length)}</b>` +
            text.substring(searchIndex + matchText.length);
        endSubstringIndex = searchIndex;
    }

    return text;
}

// Determines if the given part can be shown based on the current spoilers state
export function canShowPart(part: Item, spoilersState: Spoiler): boolean {
    if (spoilersState === "None") {
        // No spoilers, check that none of the categories are spoilers/redacted
        if (!part.categories.every((c) => c !== "Spoiler" && c !== "Redacted")) {
            return false;
        }
    } else if (spoilersState == "Spoiler") {
        // Spoilers allowed, check only for redacted category
        if (!part.categories.every((c) => c != "Redacted")) {
            return false;
        }
    } else {
        // Redacted, no checks
        return true;
    }

    return true;
}

// Determines whether something can be shown based on the spoiler state to check and the global state
export function canShowSpoiler(stateToCheck: Spoiler, globalState: Spoiler): boolean {
    if (globalState === "None" && stateToCheck !== "None") {
        // No spoilers, only show none
        return false;
    } else if (globalState == "Spoiler" && !(stateToCheck === "None" || stateToCheck === "Spoiler")) {
        // Spoilers allowed, show all but redacted
        return false;
    }

    return true;
}

// Ceil the number to the nearest multiple
export function ceilToMultiple(num: number, multiple: number) {
    return Math.ceil(num / multiple) * multiple;
}

// Creates a range line from minVal to maxVal using filled squares with the given color scheme with no unit
function rangeLine(
    category: string,
    valueString: string | undefined,
    value: number | undefined,
    defaultValueString: string | undefined,
    minValue: number,
    maxValue: number,
    colorScheme: ColorScheme,
) {
    return rangeLineUnit(category, valueString, value, "", defaultValueString, minValue, maxValue, colorScheme);
}

// Creates a range line from minVal to maxVal using filled squares with the given color scheme
function rangeLineUnit(
    category: string,
    valueString: string | undefined,
    value: number | undefined,
    unitString: string,
    defaultValueString: string | undefined,
    minValue: number,
    maxValue: number,
    colorScheme: ColorScheme,
) {
    let valueHtml: string;
    if (valueString === undefined || value === undefined) {
        valueString = defaultValueString;
        value = 0;
        valueHtml = `<span class="details-dim-text">${defaultValueString}${unitString}</span>`;
    } else {
        valueHtml = valueString + unitString;
    }

    // Determine bars and spacing
    const maxBars = 22;
    const numSpaces = 23 - 1 - 1 - category.length - (valueString as string).length - unitString.length;
    let valuePercentage: number;
    if (maxValue - minValue === 0) {
        valuePercentage = 1;
    } else {
        valuePercentage = value / (maxValue - minValue);
    }

    let fullBars = Math.min(Math.floor(maxBars * valuePercentage), 22);

    // Always round away from 0
    // This allows for things like 1/100 to show 1 bar rather than 0
    if (fullBars === 0 && value != minValue) {
        fullBars = 1;
    }

    if (minValue === maxValue) {
        fullBars = 0;
    }
    const emptyBars = maxBars - fullBars;

    // Determine color
    let colorClass: string;
    if (valuePercentage < 0.25) {
        colorClass = colorSchemes[colorScheme].low;
    } else if (valuePercentage < 0.5) {
        colorClass = colorSchemes[colorScheme].midLow;
    } else if (valuePercentage < 0.75) {
        colorClass = colorSchemes[colorScheme].midHigh;
    } else {
        colorClass = colorSchemes[colorScheme].high;
    }

    // Create bars HTML string
    let barsHtml: string;
    if (emptyBars > 0) {
        barsHtml = `<span class="${colorClass}">${"▮".repeat(
            fullBars,
        )}</span><span class="details-range-dim">${"▯".repeat(emptyBars)}</span>`;
    } else {
        barsHtml = `<span class=${colorClass}>${"▮".repeat(fullBars)}</span>`;
    }

    // Return full HTML
    return `
    <pre class="details-line"> ${category}${" ".repeat(numSpaces)}${valueHtml} ${barsHtml}</pre>
    `;
}

// Create a summary line
function summaryLine(text: string) {
    return `<pre class="details-summary">${text}</pre>`;
}

// Creates a summary line with an optional projectile multiplier
function summaryProjectileLine(item: WeaponItem, category: string) {
    if (item.projectileCount > 1) {
        return `<pre class="details-summary">${category}${" ".repeat(13)}<span class="projectile-num"> x${
            item.projectileCount
        } </span></pre>`;
    } else {
        return summaryLine(category);
    }
}

// Create a text line with an optional value and default style
function textLine(category: string, text: string | undefined = undefined) {
    if (text === undefined) {
        return `<pre class="details-line"> ${category}</pre>`;
    } else {
        const numSpaces = 23 - 1 - category.length;
        return `<pre class="details-line"> ${category}${" ".repeat(numSpaces)}${text}</pre>`;
    }
}

// Create a text line with a link
function textLineLink(
    line: string,
    link: string,
    extraText: string | undefined = undefined,
    extraAttributes: string | undefined = undefined,
) {
    extraAttributes = extraAttributes === undefined ? "" : extraAttributes;
    if (extraText === undefined) {
        return `<pre class="details-line"> <a href="${link}" ${extraAttributes}>${line}</a></pre>`;
    } else {
        const numSpaces = 23 - 1 - line.length;
        return `<pre class="details-line"> <a href="${link}" ${extraAttributes}>${line}</a>${" ".repeat(
            numSpaces,
        )}${extraText}</pre>`;
    }
}

// Create a text line with a spoiler link
function textLineSpoilerLink(line: string, link: string, extraText: string | undefined = undefined) {
    if (extraText === undefined) {
        return `<pre class="details-line"> <a href="${link}" class="spoiler-text spoiler-text-margin">${line}</a></pre>`;
    } else {
        const numSpaces = 23 - 1 - line.length;
        return `<pre class="details-line"> <a href="${link}" class="spoiler-text spoiler-text-margin">${line}</a>${" ".repeat(
            numSpaces,
        )}${extraText}</pre>`;
    }
}

// Create a text line with no value and dim style
function textLineDim(category: string, text: string) {
    const numSpaces = 23 - 1 - category.length;
    return `<pre class="details-line"> ${category}${" ".repeat(
        numSpaces,
    )}<span class="details-dim-text">${text}</span></pre>`;
}

// Create a text line with no value  and a default
function textLineWithDefault(category: string, textString: string | undefined, defaultString: string) {
    if (typeof textString != "string") {
        textString = `<span class="details-dim-text">${defaultString}</span>`;
    }

    const numSpaces = 23 - 1 - category.length;
    return `<pre class="details-line"> ${category}${" ".repeat(numSpaces)}${textString}</pre>`;
}

// Create a text line with a value and a given HTML string for the text
function textValueHtmlLine(category: string, valueString: string, valueClass: string, textHtml: string) {
    const numSpaces = 23 - 1 - 1 - category.length - valueString.length;

    let valueHtml;
    if (typeof valueClass === "string" && valueClass.length > 0) {
        valueHtml = `<span class="${valueClass}">${valueString}</span>`;
    } else {
        valueHtml = valueString;
    }

    return `<pre class="details-line"> ${category}${" ".repeat(numSpaces)}${valueHtml} ${textHtml}</pre>`;
}

// Create a value line with no text
function valueLine(category: string, valueString: string) {
    const numSpaces = 23 - 1 - category.length - 1 - valueString.length;
    return `<pre class="details-line"> ${category}${" ".repeat(numSpaces)}${valueString}</pre>`;
}

// Create a value line with units, no text, and a default
function valueLineUnitsWithDefault(
    category: string,
    valueString: string | undefined,
    unitString: string,
    defaultString: string,
) {
    let valueLength: number;
    if (valueString === undefined) {
        valueString = `<span class="details-dim-text">${defaultString}${unitString}</span>`;
        valueLength = defaultString.length + unitString.length;
    } else {
        valueString += unitString;
        valueLength = valueString.length;
    }

    const numSpaces = 23 - 1 - category.length - 1 - valueLength;
    return `<pre class="details-line"> ${category}${" ".repeat(numSpaces)}${valueString}</pre>`;
}

// Create a value line with units, text, and a default
function valueLineUnitsTextWithDefault(
    category: string,
    valueString: string | undefined,
    unitString: string,
    defaultString: string,
    text: string,
) {
    let valueLength: number;
    if (valueString === undefined) {
        valueString = `<span class="details-dim-text">${defaultString}${unitString}</span>`;
        valueLength = defaultString.length + unitString.length;
    } else {
        valueString += unitString;
        valueLength = valueString.length;
    }

    const numSpaces = 23 - 1 - category.length - 1 - valueLength;
    return `<pre class="details-line"> ${category}${" ".repeat(numSpaces)}${valueString} ${text}</pre>`;
}

// Create a value line with no text and a default
function valueLineWithDefault(category: string, valueString: string | undefined, defaultString: string) {
    let valueLength;
    if (typeof valueString != "string") {
        valueString = `<span class="details-dim-text">${defaultString}</span>`;
        valueLength = defaultString.length;
    } else {
        valueLength = valueString.length;
    }

    const numSpaces = 23 - 1 - category.length - 1 - valueLength;
    return `<pre class="details-line"> ${category}${" ".repeat(numSpaces)}${valueString}</pre>`;
}

const emptyLine = `<pre class="details-line">
    
</pre>`;

const emptyHalfLine = `<pre class="details-half-line">
    
</pre>`;

// Creates a HTML string representing a bot
export function createBotDataContent(bot: Bot, spoilers: Spoiler, popoversToLinks = false): string {
    function createItemHtml(data: BotPart, popoversToLinks: boolean) {
        let line = `${escapeHtml(data.name)} (${data.coverage}%)`;

        if (data.number > 1) {
            line += " x" + data.number;
        }
        return `${itemLine(line, data.name, popoversToLinks)}`;
    }

    function createItemOptionHtml(data: BotPart[]) {
        // Add all options
        let html = "";

        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            let line: string;
            if (item.name === "None") {
                line = "None";
            } else {
                line = `${item.name} (${item.coverage}%)`;
            }

            if (item.number > 1) {
                line += " x" + item.number;
            }

            html += itemLineOption(line, i);
        }

        return html;
    }

    function getRatingValue(bot: Bot) {
        const ratingString = bot.rating;
        const ratingArray = ratingString
            .split("-")
            .map((s) => s.trim())
            .map((s) => parseInt(s));
        return ratingArray.reduce((sum, val) => sum + val, 0) / ratingArray.length;
    }

    function getSchematicDepthString(bot: Bot) {
        function capRange(depth) {
            return Math.floor(Math.max(Math.min(10, depth), 1));
        }

        if (bot.fabrication !== undefined) {
            let levelOneDepth = 11 - parseInt(bot.tier);
            let levelTwoDepth = levelOneDepth + 1;
            let levelThreeDepth = levelTwoDepth + 1;
            levelOneDepth = capRange(levelOneDepth);
            levelTwoDepth = capRange(levelTwoDepth);
            levelThreeDepth = capRange(levelThreeDepth);
            return `1/-${levelOneDepth}  2/-${levelTwoDepth}  3/-${levelThreeDepth}`;
        }

        return "";
    }

    function itemLine(itemString: string, itemName: string | undefined, popoversToLinks: boolean) {
        // Must unescape -> escape in order to properly account for escaped characters
        // for the actual pad length
        itemString = escapeHtml(unescapeHtml(itemString).padEnd(46));

        if (popoversToLinks && itemName !== undefined) {
            itemString = `<a href="#${escapeHtml(itemName)}">${itemString}</a>`;
        }

        return (
            "" +
            `<pre class="details-part" data-toggle="popover"${popoversToLinks ? ' data-trigger="hover"' : ""}>` +
            '<span class="bot-popover-item-bracket bot-popover-item-bracket-invisible">[</span>' +
            `${itemString}` +
            '<span class="bot-popover-item-bracket bot-popover-item-bracket-invisible">]</span>' +
            "</pre>"
        );
    }

    function itemLineOption(itemString: string, i: number) {
        // Must unescape -> escape in order to properly account for escaped characters
        // for the actual pad length
        itemString = escapeHtml(unescapeHtml(itemString).padEnd(43));
        return (
            "" +
            '<pre class="details-line">' +
            '<span class="bot-popover-item-bracket bot-popover-item-bracket-invisible">[</span>' +
            `<span class="details-option">${String.fromCharCode(97 + i)}) </span>` +
            `<span>${itemString}</span>` +
            '<span class="bot-popover-item-bracket bot-popover-item-bracket-invisible">]</span>' +
            "</pre>"
        );
    }

    // Create overview
    let html = `
        <pre class="details-title">${escapeHtml(bot.name)} [<img src="${getBotImageName(bot)}"/>]</pre>
        ${emptyLine}
        ${summaryLine("Overview")}
        ${textLine("Class", bot.class)}
        ${textLine("Size", bot.size)}
        ${textLine("Profile", bot.profile)}
        ${rangeLine("Rating", bot.rating, getRatingValue(bot), undefined, 0, 165, ColorScheme.LowGood)}
        ${textLine("Tier", bot.tier)}
        ${textLine("Threat", bot.threat)}
        ${textLine("Value", bot.value.toString())}
        ${textLine("Energy Generation", bot.energyGeneration.toString())}
        ${textLine("Heat Dissipation", bot.heatDissipation.toString())}
        ${textLine("Visual Range", bot.visualRange)}
        ${textLine("Memory", bot.memory)}
        ${textLine("Spot %", bot.spotPercent)}
        ${textLine("Movement", bot.movement)}
        ${bot.movementOverloaded !== undefined ? `${textLine(" Overloaded", bot.movementOverloaded)}` : ""}
        ${rangeLine(
            "Core Integrity",
            bot.coreIntegrity.toString(),
            bot.coreIntegrity,
            undefined,
            0,
            bot.coreIntegrity,
            ColorScheme.Green,
        )}
        ${rangeLineUnit(
            "Core Exposure",
            bot.coreExposure.toString(),
            bot.coreExposure,
            "%",
            undefined,
            0,
            100,
            ColorScheme.LowGood,
        )}
        ${textLine("Salvage Potential", bot.salvagePotential)}
        ${textLineWithDefault("Schematic", bot.fabrication !== undefined ? "Hackable" : undefined, "N/A")}
        ${bot.fabrication !== undefined ? textLine(" Min Terminal/Depth", getSchematicDepthString(bot)) : ""}
        ${emptyLine}
        ${summaryLine("Armament")}
        `;

    // Add armament items and options
    if (bot.armament.length > 0) {
        bot.armamentData.forEach((data) => {
            html += createItemHtml(data, popoversToLinks);
        });

        for (let i = 0; i < bot.armamentOptionData.length; i++) {
            if (i != 0 || bot.armamentData.length > 0) {
                html += emptyLine;
            }
            html += createItemOptionHtml(bot.armamentOptionData[i]);
        }
    } else {
        html += itemLine("None", undefined, popoversToLinks);
    }

    // Add component items
    html += `
    ${emptyLine}
    ${summaryLine("Components")}
    `;

    if (bot.components.length > 0) {
        bot.componentData.forEach((data) => {
            html += createItemHtml(data, popoversToLinks);
        });

        for (let i = 0; i < bot.componentOptionData.length; i++) {
            if (i != 0 || bot.componentData.length > 0) {
                html += `${emptyLine}`;
            }
            html += createItemOptionHtml(bot.componentOptionData[i]);
        }
    } else {
        html += itemLine("N/A", undefined, popoversToLinks);
    }

    // Add Resistances/immunities
    const resistances = Object.keys(valueOrDefault(bot.resistances, {} as any));
    const immunities = bot.immunities;
    if (resistances.length > 0 || immunities.length > 0) {
        html += `
        ${emptyLine}
        ${summaryLine("Resistances")}
        `;

        resistances.forEach((damageType) => {
            const resistValue = bot.resistances![damageType];

            if (resistValue === undefined) {
                return;
            }

            if (resistValue > 0) {
                html += rangeLine(
                    damageType,
                    resistValue.toString() + "%",
                    resistValue,
                    undefined,
                    0,
                    100,
                    ColorScheme.Green,
                );
            } else {
                html += rangeLine(
                    damageType,
                    resistValue.toString() + "%",
                    resistValue,
                    undefined,
                    0,
                    -100,
                    ColorScheme.Red,
                );
            }
        });

        immunities.forEach((immunity) => {
            html += textLineDim(immunity, "IMMUNE");
        });
    }

    // Add traits
    const traits = bot.traits;
    if (traits.length > 0) {
        html += `
        ${emptyLine}
        ${summaryLine("Traits")}
        `;

        traits.forEach((trait) => {
            html += `<span class="details-description">&nbsp;${trait}</span>\n`;
        });
    }

    // Add fabrication stats if present
    if (bot.fabrication != null) {
        const number = bot.fabrication.number;

        html += `${emptyLine}`;

        if (number === "1") {
            html += summaryLine("Fabrication");
        } else {
            html += summaryLine(`Fabrication x${number}`);
        }

        html += `
        ${textLine("Time", bot.fabrication.time)}
        ${textLine("Components", "None")}
        `;
    }

    // Add description
    const description = escapeHtml(valueOrDefault(bot.description, ""));
    if (description.length > 0) {
        html += `
        ${emptyLine}
        ${summaryLine("Description")}
        <span class="details-description">&nbsp;${description}</span>
        `;
    }

    // Get filtered list of locations
    const locations = bot.locations.filter((l) => {
        if (l.Spoiler === undefined || spoilers === "Redacted") {
            return true;
        }

        if (l.Spoiler === "Redacted") {
            return false;
        }

        if (l.Spoiler === "Spoiler" && spoilers === "None") {
            return false;
        }

        return true;
    });
    if (bot.locations.length > 0) {
        // Add bot locations
        html += `
        ${emptyLine}
        ${summaryLine("Locations")}
        ${locations
            .map((location) => {
                if (location.Description !== undefined) {
                    return `<span class="details-location">&nbsp;${location.Location}</span>
                <span class="details-description">&nbsp;&nbsp;${escapeHtml(location.Description)}</span>`;
                } else {
                    return `<span class="details-location">&nbsp;${location.Location}</span>`;
                }
            })
            .join(emptyHalfLine)}
        `;
    }

    return html;
}

// Creates an HTML string representing an item
export function createItemDataContent(baseItem: Item): string {
    function getDamageValue(item: WeaponItem) {
        const damageString = item.damage as string;
        const damageArray = damageString
            .split("-")
            .map((s) => s.trim())
            .map((s) => parseInt(s));
        return damageArray.reduce((sum, val) => sum + val, 0) / damageArray.length;
    }

    function getDelayString(item: WeaponItem) {
        if (item.delay === undefined) {
            return undefined;
        } else {
            if (item.delay > 0) {
                return "+" + item.delay;
            }

            return item.delay.toString();
        }
    }

    function getExplosionValue(item: WeaponItem) {
        const damageString = item.explosionDamage as string;
        const damageArray = damageString
            .split("-")
            .map((s) => s.trim())
            .map((s) => parseInt(s));
        return damageArray.reduce((sum, val) => sum + val, 0) / damageArray.length;
    }

    const disposableUnstableRegex = /(?:Disposable|Unstable) \((\d*)\)/;
    function getPartName(item: Item): string {
        let name = escapeHtml(item.name);

        const result = disposableUnstableRegex.exec(item.specialTrait || "");
        if (result !== null) {
            name += ` (${result[1]})`;
        }

        return name;
    }

    function getPenetrationTextHtml(item: WeaponItem): string {
        const penetrationString = item.penetration;

        if (penetrationString === undefined) {
            return "";
        }

        const penetrationArray = penetrationString.split("/").map((s) => s.trim());

        return penetrationArray.join(" / ");
    }

    function getPenetrationValueClass(item: WeaponItem): string {
        if (item.penetration !== undefined) {
            return "";
        }

        return "details-dim-text";
    }

    function getPenetrationValue(item: WeaponItem): string {
        const penetrationString = item.penetration;

        if (penetrationString === undefined) {
            return "x0";
        }

        if (penetrationString === "Unlimited") {
            return "x*";
        }

        const penetrationArray = penetrationString.split("/").map((s) => s.trim());

        return "x" + penetrationArray.length;
    }

    function getRatingHtml(item: Item) {
        switch (item.category) {
            case ItemRatingCategory.Alien:
                return '<span class="rating-alien"> Alien </span>';

            case ItemRatingCategory.Prototype:
                return '<span class="rating-prototype"> Prototype </span>';

            case ItemRatingCategory.None:
                return '<span class="details-dim-text">Standard</span>';
        }
    }

    function getSchematicString(item: Item) {
        if (item.hackable) {
            return "Hackable";
        } else if (item.fabrication != null) {
            return "Not Hackable";
        }

        return undefined;
    }

    function getSchematicDepthString(item: Item) {
        function capRange(depth) {
            return Math.floor(Math.max(Math.min(10, depth), 1));
        }

        if (item.hackable) {
            let levelOneDepth = 11 - item.rating;
            let levelTwoDepth = levelOneDepth + 1;
            let levelThreeDepth = levelTwoDepth + 1;
            levelOneDepth = capRange(levelOneDepth);
            levelTwoDepth = capRange(levelTwoDepth);
            levelThreeDepth = capRange(levelThreeDepth);
            return `1/-${levelOneDepth}  2/-${levelTwoDepth}  3/-${levelThreeDepth}`;
        }

        return "";
    }

    function getSlotString(item: Item): string {
        let slotType = item.slot as string;

        if (slotType == "N/A") {
            // Take care of item special cases
            if (item.type == ItemType.Item || item.type == ItemType.Trap) {
                slotType = "Inventory";
            } else {
                return `<span class="details-dim-text">N/A</span>`;
            }
        }

        if (item.size > 1) {
            return `${slotType} x${item.size}`;
        }

        return slotType;
    }

    // Create overview
    let html = `
    <div class="item-art-image-container">
        <img src="${escapeHtml(getItemAsciiArtImageName(baseItem))}"/>
    </div>
    <pre class="details-title .details-item-image-title mt-2">${escapeHtml(
        baseItem.name,
    )} [<img src="${getItemSpriteImageName(baseItem)}"/>]</pre>
    ${emptyLine}
    ${summaryLine("Overview")}
    ${textLine("Type", baseItem.type)}
    ${textLine("Slot", getSlotString(baseItem))}
    ${rangeLine("Mass", baseItem.mass?.toString(), baseItem.mass, "N/A", 0, 15, ColorScheme.LowGood)}
    ${textValueHtmlLine(
        "Rating",
        baseItem.ratingString.replace("**", "").replace("*", ""),
        "",
        getRatingHtml(baseItem),
    )}
    ${rangeLine(
        "Integrity",
        (baseItem.noRepairs ? "*" : "") + baseItem.integrity?.toString(),
        1,
        undefined,
        0,
        1,
        ColorScheme.Green,
    )}
    ${valueLine("Coverage", baseItem.coverage?.toString() ?? "0")}
    ${textLineWithDefault("Schematic", getSchematicString(baseItem), "N/A")}
    ${baseItem.hackable ? textLine(" Min Terminal/Depth", getSchematicDepthString(baseItem)) : emptyLine}
    `;

    switch (baseItem.slot) {
        case "Power": {
            const item = baseItem as PowerItem;

            // Add power-unique categories
            html += `
                ${emptyLine}
                ${summaryLine("Active Upkeep")}
                ${rangeLine("Energy", undefined, 0, "-0", 0, 0, ColorScheme.LowGood)}
                ${rangeLine(
                    "Matter",
                    item.matterUpkeep === undefined ? undefined : "-" + item.matterUpkeep,
                    item.matterUpkeep,
                    "-0",
                    0,
                    25,
                    ColorScheme.LowGood,
                )}
                ${rangeLine("Heat", "+" + item.heatGeneration, item.heatGeneration, "+0", 0, 20, ColorScheme.LowGood)}
                ${emptyLine}
                ${summaryLine("Power")}
                ${rangeLine(
                    "Supply",
                    item.energyGeneration === undefined || item.energyGeneration === 0
                        ? undefined
                        : "+" + item.energyGeneration,
                    item.energyGeneration,
                    "0",
                    0,
                    30,
                    ColorScheme.Green,
                )}
                ${rangeLine(
                    "Storage",
                    item.energyStorage?.toString(),
                    item.energyStorage,
                    "0",
                    0,
                    300,
                    ColorScheme.Green,
                )}
                ${rangeLine(
                    "Stability",
                    item.powerStability + "%",
                    item.powerStability,
                    "N/A",
                    0,
                    100,
                    ColorScheme.HighGood,
                )}
                `;
            break;
        }

        case "Propulsion": {
            const item = baseItem as PropulsionItem;

            // Add propulsion-unique categories
            html += `
                ${emptyLine}
                ${summaryLine("Active Upkeep")}
                ${rangeLine("Energy", "-" + item.energyUpkeep, item.energyUpkeep, "-0", 0, 20, ColorScheme.LowGood)}
                ${rangeLine("Matter", undefined, 0, "-0", 0, 0, ColorScheme.LowGood)}
                ${rangeLine("Heat", "+" + item.heatGeneration, item.heatGeneration, "+0", 0, 20, ColorScheme.LowGood)}
                ${emptyLine}
                ${summaryLine("Propulsion")}
                ${rangeLine(
                    "Time/Move",
                    item.timePerMove.toString(),
                    item.timePerMove,
                    undefined,
                    0,
                    150,
                    ColorScheme.LowGood,
                )}
                ${
                    item.modPerExtra == undefined
                        ? valueLine("Drag", item.drag?.toString() ?? "0")
                        : valueLine(" Mod/Extra", item.modPerExtra.toString())
                }
                ${rangeLine("Energy", "-" + item.energyPerMove, item.energyPerMove, "-0", 0, 10, ColorScheme.LowGood)}
                ${rangeLine("Heat", "+" + item.heatPerMove, item.heatPerMove, "+0", 0, 10, ColorScheme.LowGood)}
                ${rangeLine("Support", item.support?.toString(), item.support, undefined, 0, 20, ColorScheme.HighGood)}
                ${rangeLine(" Penalty", item.penalty?.toString(), item.penalty, "0", 0, 60, ColorScheme.LowGood)}
                ${
                    item.type === ItemType.Treads
                        ? textLineWithDefault("Siege", item.siege, "N/A")
                        : rangeLine(
                              "Burnout",
                              item.burnout,
                              parseInt(item.burnout ?? ""),
                              "N/A",
                              0,
                              100,
                              ColorScheme.LowGood,
                          )
                }
                `;
            break;
        }

        case "Utility": {
            const item = baseItem as UtilityItem;

            // Add utility-unique categories
            html += `
                ${emptyLine}
                ${summaryLine("Active Upkeep")}
                ${rangeLine("Energy", "-" + item.energyUpkeep, item.energyUpkeep, "-0", 0, 20, ColorScheme.LowGood)}
                ${rangeLine("Matter", "-" + item.matterUpkeep, item.matterUpkeep, "-0", 0, 25, ColorScheme.LowGood)}
                ${rangeLine("Heat", "+" + item.heatGeneration, item.heatGeneration, "+0", 0, 20, ColorScheme.LowGood)}
                `;
            break;
        }

        case "Weapon": {
            const item = baseItem as WeaponItem;
            // Add weapon-unique categories

            switch (item.type) {
                case ItemType.BallisticCannon:
                case ItemType.BallisticGun:
                case ItemType.EnergyCannon:
                case ItemType.EnergyGun:
                    html += `
                        ${emptyLine}
                        ${summaryLine("Shot")}
                        ${rangeLine("Range", item.range.toString(), item.range, undefined, 0, 20, ColorScheme.HighGood)}
                        ${rangeLine("Energy", "-" + item.shotEnergy, item.shotEnergy, "-0", 0, 50, ColorScheme.LowGood)}
                        ${rangeLine("Matter", "-" + item.shotMatter, item.shotMatter, "-0", 0, 25, ColorScheme.LowGood)}
                        ${rangeLine("Heat", "+" + item.shotHeat, item.shotHeat, "+0", 0, 100, ColorScheme.LowGood)}
                        ${valueLineWithDefault("Recoil", item.recoil?.toString(), "0")}
                        ${valueLineUnitsWithDefault("Targeting", item.targeting?.toString(), "%", "0")}
                        ${valueLineWithDefault("Delay", getDelayString(item), "0")}
                        ${rangeLine(
                            "Stability",
                            item.overloadStability?.toString(),
                            item.overloadStability,
                            "N/A",
                            0,
                            100,
                            ColorScheme.HighGood,
                        )}
                        ${
                            item.waypoints === undefined
                                ? valueLineWithDefault("Arc", item.arc?.toString(), "N/A")
                                : valueLine("Waypoints", item.waypoints)
                        }
                        ${emptyLine}
                        ${summaryProjectileLine(item, "Projectile")}
                        ${rangeLine("Damage", item.damage, getDamageValue(item), undefined, 0, 100, ColorScheme.Green)}
                        ${textLine("Type", item.damageType)}
                        ${valueLineUnitsTextWithDefault(
                            "Critical",
                            item.critical?.toString(),
                            "%",
                            "0",
                            item.criticalType?.toString() ?? "",
                        )}
                        ${textValueHtmlLine(
                            "Penetration",
                            getPenetrationValue(item),
                            getPenetrationValueClass(item),
                            getPenetrationTextHtml(item),
                        )}
                        ${
                            item.heatTransfer === undefined
                                ? textLineWithDefault("Spectrum", item.spectrum, "N/A")
                                : textLine("Heat Transfer", item.heatTransfer)
                        }
                        ${rangeLineUnit(
                            "Disruption",
                            item.disruption?.toString(),
                            item.disruption,
                            "%",
                            "0",
                            0,
                            50,
                            ColorScheme.Green,
                        )}
                        ${valueLineWithDefault("Salvage", item.salvage?.toString(), "0")}
                        `;
                    break;

                case ItemType.Launcher:
                    html += `
                        ${emptyLine}
                        ${summaryLine("Shot")}
                        ${rangeLine("Range", item.range.toString(), item.range, undefined, 0, 20, ColorScheme.HighGood)}
                        ${rangeLine("Energy", "-" + item.shotEnergy, item.shotEnergy, "-0", 0, 50, ColorScheme.LowGood)}
                        ${rangeLine("Matter", "-" + item.shotMatter, item.shotMatter, "-0", 0, 25, ColorScheme.LowGood)}
                        ${rangeLine("Heat", "+" + item.shotHeat, item.shotHeat, "+0", 0, 100, ColorScheme.LowGood)}
                        ${valueLineWithDefault("Recoil", item.recoil?.toString(), "0")}
                        ${valueLineUnitsWithDefault("Targeting", item.targeting?.toString(), "%", "0")}
                        ${valueLineWithDefault("Delay", getDelayString(item), "0")}
                        ${rangeLine(
                            "Stability",
                            item.overloadStability?.toString(),
                            item.overloadStability,
                            "N/A",
                            0,
                            100,
                            ColorScheme.HighGood,
                        )}
                        ${
                            item.waypoints === undefined
                                ? valueLineWithDefault("Arc", item.arc?.toString(), "N/A")
                                : valueLine("Waypoints", item.waypoints)
                        }
                        ${emptyLine}
                        ${summaryProjectileLine(item, "Explosion")}
                        ${rangeLine(
                            "Radius",
                            item.explosionRadius?.toString(),
                            item.explosionRadius,
                            undefined,
                            0,
                            8,
                            ColorScheme.Green,
                        )}
                        ${rangeLine(
                            "Damage",
                            item.explosionDamage,
                            getExplosionValue(item),
                            undefined,
                            0,
                            100,
                            ColorScheme.Green,
                        )}
                        ${valueLineWithDefault(
                            " Falloff",
                            item.falloff === undefined ? undefined : "-" + item.falloff,
                            "0",
                        )}
                        ${textLine("Type", item.explosionType)}
                        ${
                            item.explosionHeatTransfer === undefined
                                ? textLineWithDefault("Spectrum", item.explosionSpectrum, "N/A")
                                : textLine("Heat Transfer", item.explosionHeatTransfer)
                        }
                        ${rangeLineUnit(
                            "Disruption",
                            item.explosionDisruption?.toString(),
                            item.explosionDisruption,
                            "%",
                            "0",
                            0,
                            50,
                            ColorScheme.Green,
                        )}
                        ${valueLineWithDefault("Salvage", item.explosionSalvage?.toString(), "0")}
                        `;
                    break;

                case ItemType.SpecialMeleeWeapon:
                    html += `
                        ${emptyLine}
                        ${summaryLine("Attack")}
                        ${rangeLine("Energy", "-" + item.shotEnergy, item.shotEnergy, "-0", 0, 50, ColorScheme.LowGood)}
                        ${rangeLine("Matter", "-" + item.shotMatter, item.shotMatter, "-0", 0, 25, ColorScheme.LowGood)}
                        ${rangeLine("Heat", "+" + item.shotHeat, item.shotHeat, "+0", 0, 100, ColorScheme.LowGood)}
                        ${valueLineUnitsWithDefault("Targeting", item.targeting?.toString(), "%", "0")}
                        ${valueLineWithDefault("Delay", getDelayString(item), "0")}
                        `;
                    break;

                case ItemType.SpecialWeapon:
                    html += `
                        ${emptyLine}
                        ${summaryLine("Shot")}
                        ${rangeLine("Range", item.range.toString(), item.range, undefined, 0, 20, ColorScheme.HighGood)}
                        ${rangeLine("Energy", "-" + item.shotEnergy, item.shotEnergy, "-0", 0, 50, ColorScheme.LowGood)}
                        ${rangeLine("Matter", "-" + item.shotMatter, item.shotMatter, "-0", 0, 25, ColorScheme.LowGood)}
                        ${rangeLine("Heat", "+" + item.shotHeat, item.shotHeat, "+0", 0, 100, ColorScheme.LowGood)}
                        ${valueLineWithDefault("Recoil", item.recoil?.toString(), "0")}
                        ${valueLineUnitsWithDefault("Targeting", item.targeting?.toString(), "%", "0")}
                        ${valueLineWithDefault("Delay", getDelayString(item), "0")}
                        ${rangeLine(
                            "Stability",
                            item.overloadStability?.toString(),
                            item.overloadStability,
                            "N/A",
                            0,
                            100,
                            ColorScheme.HighGood,
                        )}
                        ${
                            item.waypoints === undefined
                                ? valueLineWithDefault("Arc", item.arc?.toString(), "N/A")
                                : valueLine("Waypoints", item.waypoints)
                        }
                        `;

                    if (item.damage !== undefined) {
                        // Only some special weapons have a damage section
                        html += `
                        ${emptyLine}
                        ${summaryProjectileLine(item, "Projectile")}
                        ${rangeLine("Damage", item.damage, getDamageValue(item), undefined, 0, 100, ColorScheme.Green)}
                        ${textLine("Type", item.damageType)}
                        ${valueLineUnitsTextWithDefault(
                            "Critical",
                            item.critical?.toString(),
                            "%",
                            "0",
                            item.criticalType?.toString() ?? "",
                        )}

                        ${textValueHtmlLine(
                            "Penetration",
                            getPenetrationValue(item),
                            getPenetrationValueClass(item),
                            getPenetrationTextHtml(item),
                        )}
                        ${
                            item.heatTransfer === undefined
                                ? textLineWithDefault("Spectrum", item.spectrum, "N/A")
                                : textLine("Heat Transfer", item.heatTransfer)
                        }
                        ${rangeLineUnit(
                            "Disruption",
                            item.disruption?.toString(),
                            item.disruption,
                            "%",
                            "0",
                            0,
                            50,
                            ColorScheme.Green,
                        )}
                        ${valueLineWithDefault("Salvage", item.salvage?.toString(), "0")}
                        `;
                    } else if (item.explosionDamage !== undefined) {
                        html += `
                        ${emptyLine}
                        ${summaryProjectileLine(item, "Explosion")}
                        ${rangeLine(
                            "Radius",
                            item.explosionRadius?.toString(),
                            item.explosionRadius,
                            undefined,
                            0,
                            8,
                            ColorScheme.Green,
                        )}
                        ${rangeLine(
                            "Damage",
                            item.explosionDamage,
                            getExplosionValue(item),
                            undefined,
                            0,
                            100,
                            ColorScheme.Green,
                        )}
                        ${valueLineWithDefault(
                            " Falloff",
                            item.falloff === undefined ? undefined : "-" + item.falloff,
                            "0",
                        )}
                        ${textLine("Type", item.explosionType)}
                        ${textLineWithDefault("Spectrum", item.explosionSpectrum, "N/A")}
                        ${rangeLineUnit(
                            "Disruption",
                            item.explosionDisruption?.toString(),
                            item.explosionDisruption,
                            "%",
                            "0",
                            0,
                            50,
                            ColorScheme.Green,
                        )}
                        ${valueLineWithDefault("Salvage", item.explosionSalvage?.toString(), "0")}
                        `;
                    }
                    break;

                case ItemType.ImpactWeapon:
                case ItemType.SlashingWeapon:
                case ItemType.PiercingWeapon:
                    html += `
                        ${emptyLine}
                        ${summaryLine("Attack")}
                        ${rangeLine("Energy", "-" + item.shotEnergy, item.shotEnergy, "-0", 0, 50, ColorScheme.LowGood)}
                        ${rangeLine("Matter", "-" + item.shotMatter, item.shotMatter, "-0", 0, 25, ColorScheme.LowGood)}
                        ${rangeLine("Heat", "+" + item.shotHeat, item.shotHeat, "+0", 0, 100, ColorScheme.LowGood)}
                        ${valueLineUnitsWithDefault("Targeting", item.targeting?.toString(), "%", "0")}
                        ${valueLineWithDefault("Delay", getDelayString(item), "0")}
                        ${emptyLine}
                        ${summaryLine("Hit")}
                        ${rangeLine("Damage", item.damage, getDamageValue(item), undefined, 0, 100, ColorScheme.Green)}
                        ${textLine("Type", item.damageType)}
                        ${valueLineUnitsTextWithDefault(
                            "Critical",
                            item.critical?.toString(),
                            "%",
                            "0",
                            item.criticalType?.toString() ?? "",
                        )}
                        ${rangeLineUnit(
                            "Disruption",
                            item.disruption?.toString(),
                            item.disruption,
                            "%",
                            "0",
                            0,
                            50,
                            ColorScheme.Green,
                        )}
                        ${valueLineWithDefault("Salvage", item.salvage?.toString(), "0")}
                        `;
                    break;

                default:
                    throw "Unhandled weapon type";
            }
        }
    }

    // Add effect/description if present
    if (baseItem.effect !== undefined || baseItem.description !== undefined) {
        html += `
        ${emptyLine}
        ${summaryLine("Effect")}
        `;

        if (baseItem.effect !== undefined) {
            html += `<span class="details-description">&nbsp;${escapeHtml(baseItem.effect)}</span>`;

            if (baseItem.description !== undefined) {
                html += `${emptyLine}`;
            }
        }

        if (baseItem.description !== undefined) {
            html += `<span class="details-description">&nbsp;${escapeHtml(baseItem.description)}</span>`;
        }
    }

    // Add fabrication stats if present
    if (baseItem.fabrication != null) {
        const number = baseItem.fabrication.number;

        html += `${emptyLine}`;

        if (number === "1") {
            html += summaryLine("Fabrication");
        } else {
            html += summaryLine(`Fabrication x${number}`);
        }

        html += `
        ${textLine("Time", baseItem.fabrication.time)}
        ${textLine("Components", "None")}
        `;
    }

    return html;
}

export function createImagePath(url: string) {
    return rootDirectory + url;
}

export function createLocationHtml(location: MapLocation, spoilersState: Spoiler, inPopover: boolean): string {
    function getDepthString(minDepth: number, maxDepth: number) {
        if (minDepth === maxDepth) {
            return minDepth.toString();
        } else {
            return `${minDepth} to ${maxDepth}`;
        }
    }

    function getMinMaxDepths(startLocation: MapLocation, endLocation: MapLocation) {
        let minDepth: number;
        let maxDepth: number;

        if (endLocation.branch || startLocation.preDepthBranch) {
            minDepth = Math.max(startLocation.minDepth, endLocation.minDepth);
            maxDepth = Math.min(startLocation.maxDepth, endLocation.maxDepth);
        } else {
            minDepth = Math.max(startLocation.minDepth, endLocation.minDepth - 1);
            maxDepth = Math.min(startLocation.maxDepth, endLocation.maxDepth - 1);
        }

        return { minDepth: minDepth, maxDepth: maxDepth };
    }

    let html = `
        ${summaryLine(location.name)}
        ${
            location.imageName === undefined
                ? ""
                : `<a href="${createImagePath(
                      `wiki_images/${location.imageName}`,
                  )}" target="_blank"><img src="wiki_images/${location.imageName}" class="location-image"/></a>`
        }
        ${textLine("Available depths", getDepthString(location.minDepth, location.maxDepth))}
        ${textLine("Branch", location.branch || location.preDepthBranch ? "Yes" : "No")}
    `;

    const allowedEntries = location.entries.filter((e) =>
        location.branch ? canShowSpoiler(e.spoiler, spoilersState) : !e.branch,
    );
    if (allowedEntries.length > 0) {
        html += `
        ${emptyLine}
        ${summaryLine("Entry from")}
        `;

        for (const entry of allowedEntries) {
            const depths = getMinMaxDepths(entry, location);
            const depthsString = getDepthString(depths.minDepth, depths.maxDepth);

            // Don't bother showing entrances from spoiler-blocked maps
            if (canShowSpoiler(entry.spoiler, spoilersState)) {
                if (inPopover) {
                    html += textLine(entry.name, depthsString);
                } else {
                    const extraAttributes = `data-html=true data-content='${createLocationHtml(
                        entry,
                        spoilersState,
                        true,
                    )}' data-toggle="popover" data-trigger="hover" data-boundary="window"`;
                    html += textLineLink(entry.name, `#${entry.name}`, depthsString, extraAttributes);
                }
            }
        }
    }

    if (location.exits.length > 0) {
        html += `
        ${emptyLine}
        ${summaryLine("Exits to")}
        `;

        for (const exit of location.exits) {
            const depths = getMinMaxDepths(location, exit);
            const depthsString = getDepthString(depths.minDepth, depths.maxDepth);
            if (inPopover) {
                // In popovers never show spoilered things
                if (canShowSpoiler(exit.spoiler, spoilersState)) {
                    html += textLine(exit.name, depthsString);
                }
            } else {
                // Show exits with a spoiler
                if (canShowSpoiler(exit.spoiler, spoilersState)) {
                    const extraAttributes = `data-html=true data-content='${createLocationHtml(
                        exit,
                        spoilersState,
                        true,
                    )}' data-toggle="popover" data-trigger="hover" data-boundary="window"`;
                    html += textLineLink(exit.name, `#${exit.name}`, depthsString, extraAttributes);
                } else {
                    html += textLineSpoilerLink(exit.name, `#${exit.name}`, depthsString);
                }
            }
        }
    }

    if (location.specialBots.length > 0) {
        html += `
        ${emptyLine} 
        ${summaryLine("Special bots")}
        `;

        for (const specialBot of location.specialBots) {
            if (inPopover) {
                if (canShowSpoiler(specialBot.spoiler, spoilersState)) {
                    html += textLine(escapeHtml(specialBot.name));
                }
            } else {
                if (canShowSpoiler(specialBot.spoiler, spoilersState)) {
                    const extraAttributes = `data-html=true data-content='${createBotDataContent(
                        specialBot,
                        spoilersState,
                    )}' data-toggle="popover" data-trigger="hover" data-boundary="window"`;
                    html += textLineLink(specialBot.name, `#${specialBot.name}`, undefined, extraAttributes);
                } else {
                    html += textLineSpoilerLink(specialBot.name, `#${specialBot.name}`);
                }
            }
        }
    }

    if (location.specialItems.length > 0) {
        html += `
        ${emptyLine}
        ${summaryLine("Special items")}
        `;

        for (const specialItem of location.specialItems) {
            if (inPopover) {
                if (canShowSpoiler(specialItem.spoiler, spoilersState)) {
                    html += textLine(escapeHtml(specialItem.name));
                }
            } else {
                if (canShowSpoiler(specialItem.spoiler, spoilersState)) {
                    const extraAttributes = `data-html=true data-content='${createItemDataContent(
                        specialItem,
                    )}' data-toggle="popover" data-trigger="hover" data-boundary="window"`;

                    html += textLineLink(specialItem.name, `#${specialItem.name}`, undefined, extraAttributes);
                } else {
                    html += textLineSpoilerLink(specialItem.name, `#${specialItem.name}`);
                }
            }
        }
    }

    return html;
}

// Escapes the given string with HTML entities
export function escapeHtml(string: string): string {
    return string.replace(/[&<>"'`=/\n]/g, function (s) {
        return entityMap[s];
    });
}

// Flatten an array of arrays into a single array
export function flatten<T>(arrays: Array<Array<T>>): Array<T> {
    const array: Array<T> = [];
    return array.concat(...arrays);
}

// Do a lexicographical sort based on the no-prefix item name
export function gallerySort(itemA: Item, itemB: Item): number {
    const noPrefixA = getNoPrefixName(itemA.name);
    const noPrefixB = getNoPrefixName(itemB.name);
    let res = noPrefixA < noPrefixB ? -1 : noPrefixA > noPrefixB ? 1 : 0;

    if (res === 0) {
        // If no-prefix names match then use index in gallery export
        // There may be some formula to determine the real order or
        // it may be a hand-crafted list, I couldn't tell either way.
        // The export index will always be ordered for different prefix
        // versions of the same parts so this is the best way to sort
        // them how the in-game gallery does.
        res = itemA.index - itemB.index;
    }

    return res;
}

export function getBotImageName(bot: Bot) {
    const imageName = botNameImageMap.get(bot.name);
    if (imageName !== undefined) {
        return createImagePath(`game_sprites/${imageName}.png`);
    }

    return createImagePath(`game_sprites/${bot.class}.png`);
}

// Gets the sprite image name of an item
export function getItemSpriteImageName(item: Item): string {
    return createImagePath(`game_sprites/${item.type}.png`);
}

// Gets the sprite image name of an item
export function getItemAsciiArtImageName(item: Item): string {
    if (itemsWithNoArt.has(item.name)) {
        // Some items have no gallery art
        return createImagePath("part_art/No Image Data.png");
    }

    return createImagePath(`part_art/${item.name.replace(/"/g, "").replace(/\//g, "")}.png`);
}

// Gets a location string with query parameters based on the given state object
export function getLocationFromState<T extends object>(
    baseLocation: string,
    stateObject: T,
    skipMember: (key: string, stateObject: T) => boolean,
) {
    let location = baseLocation;
    let search = "";

    for (const key of Object.keys(stateObject)) {
        if (stateObject[key] !== undefined) {
            if (skipMember(key, stateObject)) {
                continue;
            }

            if (typeof stateObject[key] === "string" && (stateObject[key] as string).length === 0) {
                // Skip empty values
                continue;
            }

            const paramValue = (stateObject[key] as string).replaceAll(" ", "%20").replaceAll("#", "%23").replaceAll("&", "%26");

            // Append to search
            if (search.length === 0) {
                search = `${key}=${paramValue}`;
            } else {
                search += `&${key}=${paramValue}`;
            }
        }
    }

    if (search.length > 0) {
        location += `?${search}`;
    }

    return location;
}

// Gets the movement name given a propulsion type
export function getMovementText(propulsionType: ItemType | undefined): string {
    switch (propulsionType) {
        case ItemType.FlightUnit:
            return "Flying";
        case ItemType.HoverUnit:
            return "Hovering";
        case ItemType.Leg:
            return "Walking";
        case ItemType.Treads:
            return "Treading";
        case ItemType.Wheel:
            return "Rolling";
        default:
            return "Core";
    }
}

// Gets the top 2 highest values in an array, or 0 if undefined
export function getTopTwoValues(values: number[]) {
    values = values.sort((a, b) => b - a).splice(0, 2);
    return [values[0] === undefined ? 0 : values[0], values[1] === undefined ? 0 : values[1]];
}

// Gets a per-TU value scaled to the given number of TUs
export function getValuePerTus(baseValue: number, numTus: number): number {
    return (baseValue * numTus) / 100;
}

// Removes the prefix from an item name
const noPrefixRegex = /\w{3}\. (.*)/;
export function getNoPrefixName(name: string): string {
    const newName = name.replace(noPrefixRegex, "$1");
    return newName;
}

export function getSpoilersValue<T>(spoilers: Spoiler, noSpoilerValue: T, spoilersValue: T, redactedValue: T): T {
    if (spoilers === "Spoiler") {
        return spoilersValue;
    } else if (spoilers === "Redacted") {
        return redactedValue;
    } else {
        return noSpoilerValue;
    }
}

// Checks if a part has an active special property of the given type
export function hasActiveSpecialProperty(
    part: Item,
    partActive: boolean,
    propertyType: SpecialPropertyTypeName,
): boolean {
    if (part.specialProperty === undefined) {
        return false;
    }

    if (part.specialProperty.trait.kind !== propertyType) {
        return false;
    }

    if (part.specialProperty.active === "Part Active" && !partActive) {
        return false;
    }

    return true;
}

export function isDev() {
    return process.env.NODE_ENV === "development";
}

// Determines if the given item type is melee
export function isPartMelee(part: BaseItem): boolean {
    if (
        part.type === ItemType.ImpactWeapon ||
        part.type === ItemType.PiercingWeapon ||
        part.type === ItemType.SlashingWeapon ||
        part.type === ItemType.SpecialMeleeWeapon
    ) {
        return true;
    }

    return false;
}

// Converts leetspeak numbers in a string to characters
export function leetSpeakMatchTransform(name: string): string {
    return name
        .replace(/0/, "o")
        .replace(/1/, "i")
        .replace(/3/, "e")
        .replace(/4/, "a")
        .replace(/7/, "t")
        .replace(/5/, "s")
        .replace(/8/, "b");
}

// Returns a promise waiting for the given image url to be loaded, returns success of load
// Will log to console if image not found
export async function loadImage(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            resolve(true);
        };
        image.onerror = () => {
            console.log(`Found invalid image ${image.src}`);
            resolve(false);
        };
        image.src = imageUrl;
    });
}

// Converts an item or bot's name to an HTML id
const nameToIdRegex = /[ /.'"\][]]*/g;
export function nameToId(name: string): string {
    const id = `item${name.replace(nameToIdRegex, "")}`;
    return id;
}

// Parses the string into a number or null if invalid
export function parseFloatOrUndefined(value: string | undefined): number | undefined {
    const int = parseFloat(value ?? "");

    if (isNaN(int)) {
        return undefined;
    }

    return int;
}

// Attempts to parse an int from the string, otherwise uses the default value
export function parseIntOrDefault(string: string | number | undefined, defaultVal: number): number {
    const value = parseInt(string as string);
    if (isNaN(value)) {
        return defaultVal;
    }

    return value;
}

// Parses the string into a number or undefined if invalid
export function parseIntOrUndefined(value: string | undefined): number | undefined {
    const int = parseInt(value ?? "");

    if (isNaN(int)) {
        return undefined;
    }

    return int;
}

const paramRegex = /^(.*)=(.*)$/;
export function parseSearchParameters<T>(search: string, object: T): T {
    if (search.length === 0) {
        // If no search state set then return default of no state set
        return object;
    }

    const setParams = search.split("&");

    for (const param of setParams) {
        const match = paramRegex.exec(param);
        if (!match) {
            // Failed to get param out of URL, just ignore
            console.log(`Failed to parse page parameter ${param}`);
            continue;
        }

        const paramName = match[1];
        const paramValue = match[2];

        // Assign the parameter
        object[paramName] = paramValue.replace("%23", "#").replace("%26", "&");
    }

    return object;
}

// Gets a random integer between the min and max values (inclusive)
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sums the two values
export function sum(a: number, b: number): number {
    return a + b;
}

// Unescapes the given string with HTML entities
export function unescapeHtml(string: string): string {
    for (const entity of Object.keys(entityMap)) {
        string = string.replace(new RegExp(entityMap[entity], "g"), entity);
    }

    return string;
}

// Returns the value if it's not undefined, otherwise return defaultVal
export function valueOrDefault<T>(val: T | undefined, defaultVal: T): T {
    if (val === undefined) {
        return defaultVal;
    }

    return val;
}
