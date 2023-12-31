import "bootstrap";
import "bootstrap-select";
import jQuery from "jquery";
import lozad from "lozad";
import "tablesorter";
import { MappedSettings, TablesorterHeading, TextSorter } from "tablesorter";

import items from "../json/items.json";
import {
    Critical,
    DamageType,
    HeatTransfer,
    Item,
    ItemCategory,
    ItemSlot,
    ItemType,
    ItemWithUpkeep,
    PowerItem,
    PropulsionItem,
    SiegeMode,
    Spectrum,
    WeaponItem,
} from "./types/itemTypes";
import {
    createItemDataContent,
    escapeHtml,
    gallerySort,
    getItem,
    getItemAsciiArtImageName,
    initData,
    itemData,
    itemsWithNoArt,
    leetSpeakMatchTransform,
    nameToId,
    parseIntOrDefault,
} from "./utilities/common";
import {
    createHeader,
    getSelectedButtonId,
    getSpoilerState,
    refreshSelectpicker,
    registerDisableAutocomplete,
    resetButtonGroup,
    setSpoilerState,
} from "./utilities/commonJquery";

const jq = jQuery.noConflict();
jq(function ($) {
    // Use for testing with new parts
    const generateAllHtml = false;

    // Enum representing the selected viewing mode
    type ViewMode = "Simple" | "Comparison" | "Spreadsheet" | "Gallery";

    type CategoryId =
        | "category0b10"
        | "categoryAlien"
        | "categoryArchitects"
        | "categoryDerelict"
        | "categoryExile"
        | "categoryGolem"
        | "categoryHeroes"
        | "categoryLab"
        | "categoryQuarantine"
        | "categoryS7Guarded"
        | "categoryS7Hangar"
        | "categoryS7Lrc"
        | "categoryS7Unguarded"
        | "categorySpoiler"
        | "categoryRedacted"
        | "categoryTesting"
        | "categoryUnobtainable"
        | "categoryWarlord"
        | "categoryZion"
        | "categoryZionite";

    const categoryIdToCategoryMap: Map<CategoryId, ItemCategory> = new Map<CategoryId, ItemCategory>([
        ["category0b10", "0b10"],
        ["categoryAlien", "Alien"],
        ["categoryArchitects", "Architects"],
        ["categoryDerelict", "Derelict"],
        ["categoryExile", "Exile"],
        ["categoryGolem", "Golem"],
        ["categoryHeroes", "Heroes"],
        ["categoryLab", "Lab"],
        ["categoryQuarantine", "Quarantine"],
        ["categoryS7Guarded", "S7 Guarded"],
        ["categoryS7Lrc", "S7 LRC Lab"],
        ["categoryS7Hangar", "S7 Hangar"],
        ["categoryS7Unguarded", "S7 Unguarded"],
        ["categorySpoiler", "Spoiler"],
        ["categoryRedacted", "Redacted"],
        ["categoryTesting", "Testing"],
        ["categoryUnobtainable", "Unobtainable"],
        ["categoryWarlord", "Warlord"],
        ["categoryZion", "Zion"],
        ["categoryZionite", "Zionite"],
    ]);

    // Maps of item names to item elements
    const galleryItemElements = {};
    const simpleItemElements = {};
    const spreadsheetItemElements = {};

    // List of Spoiler+ only categories
    const spoilerCategoryIds: CategoryId[] = [
        "categoryAlien",
        "categoryGolem",
        "categoryHeroes",
        "categoryQuarantine",
        "categorySpoiler",
        "categoryTesting",
        "categoryWarlord",
        "categoryZion",
        "categoryZionite",
    ];

    const redactedCategoryIds: CategoryId[] = [
        "categoryArchitects",
        "categoryLab",
        "categoryRedacted",
        "categoryS7Guarded",
        "categoryS7Hangar",
        "categoryS7Lrc",
        "categoryS7Unguarded",
    ];

    // Slot ID -> Slot string
    const slotMap: { [key: string]: string } = {
        slotOther: "N/A",
        slotPower: "Power",
        slotPropulsion: "Propulsion",
        slotUtility: "Utility",
        slotWeapon: "Weapon",
    };

    // Terminal ID -> int level
    const terminalLevelMap: { [key: string]: number } = {
        terminalLevel1: 1,
        terminalLevel2: 2,
        terminalLevel3: 3,
    };

    // Type ID -> Type string
    const typeMap: { [key: string]: string } = {
        powerTypeEngine: "Engine",
        powerTypePowerCore: "Power Core",
        powerTypeReactor: "Reactor",
        propTypeFlight: "Flight Unit",
        propTypeHover: "Hover Unit",
        propTypeLeg: "Leg",
        propTypeTread: "Treads",
        propTypeWheel: "Wheel",
        utilTypeArtifact: "Artifact",
        utilTypeDevice: "Device",
        utilTypeHackware: "Hackware",
        utilTypeProcessor: "Processor",
        utilTypeProtection: "Protection",
        utilTypeStorage: "Storage",
        weaponTypeBallisticCannon: "Ballistic Cannon",
        weaponTypeBallisticGun: "Ballistic Gun",
        weaponTypeEnergyCannon: "Energy Cannon",
        weaponTypeEnergyGun: "Energy Gun",
        weaponTypeImpactWeapon: "Impact Weapon",
        weaponTypeLauncher: "Launcher",
        weaponTypePiercingWeapon: "Piercing Weapon",
        weaponTypeSlashingWeapon: "Slashing Weapon",
        weaponTypeSpecialMeleeWeapon: "Special Melee Weapon",
        weaponTypeSpecialWeapon: "Special Weapon",
    };

    // Slot ID -> Type button container ID
    const slotIdToTypeIdMap: { [key: string]: string } = {
        slotPower: "powerTypeContainer",
        slotPropulsion: "propTypeContainer",
        slotUtility: "utilTypeContainer",
        slotWeapon: "weaponTypeContainer",
    };

    // Sorting functions
    function alphabeticalSort(a: string | undefined, b: string | undefined) {
        const aValue = typeof a === "string" ? a : "";
        const bValue = typeof b === "string" ? b : "";

        return aValue.localeCompare(bValue);
    }

    function criticalSort(a: string | undefined, b: string | undefined) {
        function reorderName(criticalString: string | undefined) {
            if (typeof criticalString != "string") {
                return "";
            }

            // Try to parse a [crit]% [critType] b11 string
            let result = /(\d+)% (\w*)/.exec(criticalString);
            if (result === null) {
                // Try to parse a simple number string, use destroy crit by default
                result = /(\d+)/.exec(criticalString);
                if (result === null) {
                    return "";
                }
                // Format crit % with 3 digits for proper sorting
                return (
                    "Destroy" +
                    parseInt(result[1]).toLocaleString("en-us", { minimumIntegerDigits: 3, useGrouping: false })
                );
            }

            // Format crit % with 3 digits for proper sorting
            return (
                result[2] + parseInt(result[1]).toLocaleString("en-US", { minimumIntegerDigits: 3, useGrouping: false })
            );
        }

        const aValue = reorderName(a);
        const bValue = reorderName(b);

        return aValue.localeCompare(bValue);
    }

    function damageSort(a: string, b: string) {
        function getAverage(damageString: string) {
            if (typeof damageString != "string" || damageString === "") {
                return 0;
            }

            const damageArray = damageString
                .split("-")
                .map((s) => s.trim())
                .map((s) => parseInt(s));
            return damageArray.reduce((sum, val) => sum + val, 0) / damageArray.length;
        }

        const aValue = getAverage(a);
        const bValue = getAverage(b);

        return aValue - bValue;
    }

    function heatSort(a: string, b: string) {
        function getValue(val: string | undefined) {
            if (val === undefined) {
                return 0;
            }
            const lowerVal = val.toLowerCase();
            if (lowerVal.startsWith("minimal")) {
                return 5;
            }
            if (lowerVal.startsWith("low")) {
                return 25;
            }
            if (lowerVal.startsWith("medium")) {
                return 37;
            }
            if (lowerVal.startsWith("high")) {
                return 50;
            }
            if (lowerVal.startsWith("massive")) {
                return 80;
            }
            if (lowerVal.startsWith("deadly")) {
                return 100;
            }

            return 0;
        }

        const aValue = getValue(a);
        const bValue = getValue(b);

        return aValue - bValue;
    }

    function integerSort(a: string, b: string) {
        let aValue = parseInt(a);
        let bValue = parseInt(b);

        if (isNaN(aValue)) {
            aValue = 0;
        }
        if (isNaN(bValue)) {
            bValue = 0;
        }

        return aValue - bValue;
    }

    function spectrumSort(a: string, b: string) {
        function getValue(val: string | undefined) {
            if (val === undefined) {
                return 0;
            }
            const lowerVal = val.toLowerCase();
            if (lowerVal.startsWith("wide")) {
                return 10;
            }
            if (lowerVal.startsWith("intermediate")) {
                return 30;
            }
            if (lowerVal.startsWith("narrow")) {
                return 50;
            }
            if (lowerVal.startsWith("fine")) {
                return 100;
            }

            return 0;
        }

        const aValue = getValue(a);
        const bValue = getValue(b);

        return aValue - bValue;
    }

    // Slot categories to show for spreadsheet view
    type partSlotCategory = {
        name: string;
        propertyName?: string;
        propertyNames?: string[];
        sorter?: TextSorter;
    };
    type PartSlotCategoryLookup = { [key: string]: partSlotCategory[] };
    const otherSlotCategories: PartSlotCategoryLookup = {
        Overview: [
            { name: "Name" },
            { name: "Type" },
            { name: "Rating", propertyName: "ratingString" },
            { name: "Size" },
            { name: "Integrity" },
            { name: "Life" },
        ],
        Effect: [{ name: "Effect" }, { name: "Description" }],
    };
    const powerSlotCategories: PartSlotCategoryLookup = {
        Overview: [
            { name: "Name", sorter: alphabeticalSort },
            { name: "Type" },
            { name: "Rating", propertyName: "ratingString" },
            { name: "Size" },
            { name: "Mass" },
            { name: "Integrity" },
            { name: "Coverage" },
            { name: "Heat", propertyName: "heatGeneration" },
        ],
        Power: [
            { name: "Rate", propertyName: "energyGeneration" },
            { name: "Storage", propertyName: "energyStorage" },
            { name: "Stability", propertyName: "powerStability" },
        ],
        Fabrication: [
            { name: "Matter", propertyNames: ["fabrication", "matter"] },
            { name: "Count", propertyNames: ["fabrication", "number"] },
            { name: "Time", propertyNames: ["fabrication", "time"] },
        ],
    };
    const propulsionSlotCategories: PartSlotCategoryLookup = {
        Overview: [
            { name: "Name", sorter: alphabeticalSort },
            { name: "Type" },
            { name: "Rating", propertyName: "ratingString" },
            { name: "Size" },
            { name: "Integrity" },
            { name: "Coverage" },
        ],
        Upkeep: [
            { name: "Energy", propertyName: "energyUpkeep" },
            { name: "Heat", propertyName: "heatGeneration" },
        ],
        Propulsion: [
            { name: "Time/Move", propertyName: "timePerMove" },
            { name: "Mod/Extra", propertyName: "modPerExtra" },
            { name: "drag" },
            { name: "Energy", propertyName: "energyPerMove" },
            { name: "Heat", propertyName: "heatPerMove" },
            { name: "Support" },
            { name: "Penalty" },
            { name: "Burnout" },
            { name: "Siege" },
        ],
        Fabrication: [
            { name: "Matter", propertyNames: ["fabrication", "matter"] },
            { name: "Count", propertyNames: ["fabrication", "number"] },
            { name: "Time", propertyNames: ["fabrication", "time"] },
        ],
    };
    const utilitySlotCategories: PartSlotCategoryLookup = {
        Overview: [
            { name: "Name", sorter: alphabeticalSort },
            { name: "Type" },
            { name: "Rating", propertyName: "ratingString" },
            { name: "Size" },
            { name: "Mass" },
            { name: "Integrity" },
            { name: "Coverage" },
            { name: "Special Trait", propertyName: "specialTrait" },
        ],
        Upkeep: [
            { name: "Energy", propertyName: "energyUpkeep" },
            { name: "Matter", propertyName: "matterUpkeep" },
            { name: "Heat", propertyName: "heatGeneration" },
        ],
        Fabrication: [
            { name: "Matter", propertyNames: ["fabrication", "matter"] },
            { name: "Count", propertyNames: ["fabrication", "number"] },
            { name: "Time", propertyNames: ["fabrication", "time"] },
        ],
        Effect: [{ name: "Effect" }, { name: "Description" }],
    };
    const WeaponSlotCategories: PartSlotCategoryLookup = {
        Overview: [
            { name: "Name", sorter: alphabeticalSort },
            { name: "Type" },
            { name: "Rating", propertyName: "ratingString" },
            { name: "Size" },
            { name: "Mass" },
            { name: "Integrity" },
            { name: "Coverage" },
            { name: "Special Trait", propertyName: "specialTrait" },
        ],
        Shot: [
            { name: "Range" },
            { name: "Energy", propertyName: "shotEnergy" },
            { name: "Matter", propertyName: "shotMatter" },
            { name: "Heat", propertyName: "shotHeat" },
            { name: "Recoil" },
            { name: "Targeting" },
            { name: "Delay" },
            { name: "Stability", propertyName: "overloadStability" },
            { name: "Waypoints" },
        ],
        Projectile: [
            { name: "Arc" },
            { name: "Count", propertyName: "projectileCount" },
            { name: "Damage", sorter: damageSort },
            { name: "Type", propertyName: "damageType" },
            { name: "Critical", propertyName: "criticalString", sorter: criticalSort },
            { name: "Penetration" },
            { name: "Heat Transfer", propertyName: "heatTransfer", sorter: heatSort },
            { name: "Spectrum", sorter: spectrumSort },
            { name: "Disruption" },
            { name: "Salvage" },
        ],
        Explosion: [
            { name: "Radius", propertyName: "explosionRadius" },
            { name: "Damage", propertyName: "explosionDamage", sorter: damageSort },
            { name: "Falloff", propertyName: "falloff" },
            { name: "Type", propertyName: "explosionType" },
            { name: "Heat Transfer", propertyName: "explosionHeatTransfer", sorter: heatSort },
            { name: "Spectrum", propertyName: "explosionSpectrum", sorter: spectrumSort },
            { name: "Disruption", propertyName: "explosionDisruption" },
            { name: "Salvage", propertyName: "explosionSalvage" },
        ],
        Fabrication: [
            { name: "Matter", propertyNames: ["fabrication", "matter"] },
            { name: "Count", propertyNames: ["fabrication", "number"] },
            { name: "Time", propertyNames: ["fabrication", "time"] },
        ],
        Effect: [{ name: "Effect" }, { name: "Description" }],
    };

    const slotCategories: { [key: string]: PartSlotCategoryLookup } = {
        "N/A": otherSlotCategories,
        Power: powerSlotCategories,
        Propulsion: propulsionSlotCategories,
        Utility: utilitySlotCategories,
        Weapon: WeaponSlotCategories,
    };

    $(() => init());

    // Creates comparison HTML data for two items
    function createComparisonDataContent(leftItem: Item, rightItem: Item): string {
        const emptyLine = `<pre class="comparison-neutral">
    
</pre>`;

        function compareNeutralStat(leftValue: number, rightValue: number) {
            if (leftValue === rightValue) {
                return emptyLine;
            } else if (leftValue < rightValue) {
                return `<pre class="comparison-neutral">(+${rightValue - leftValue})</pre>`;
            } else {
                return `<pre class="comparison-neutral">(-${leftValue - rightValue})</pre>`;
            }
        }

        function compareHighBadStat(leftValue: number, rightValue: number) {
            if (leftValue === rightValue) {
                return emptyLine;
            } else if (leftValue < rightValue) {
                return `<pre class="comparison-negative">+${rightValue - leftValue}</pre>`;
            } else {
                return `<pre class="comparison-positive">-${leftValue - rightValue}</pre>`;
            }
        }

        function compareHighGoodStat(leftValue: number, rightValue: number) {
            if (leftValue === rightValue) {
                return emptyLine;
            } else if (leftValue < rightValue) {
                return `<pre class="comparison-positive">+${rightValue - leftValue}</pre>`;
            } else {
                return `<pre class="comparison-negative">-${leftValue - rightValue}</pre>`;
            }
        }

        function compareRating(leftItem: Item, rightItem: Item) {
            const leftRating = Math.ceil(leftItem.rating);
            const rightRating = Math.ceil(rightItem.rating);
            if (leftRating === rightRating) {
                return emptyLine;
            } else if (leftRating < rightRating) {
                let differenceString: string;
                if (leftItem.ratingString.includes("*") || rightItem.ratingString.includes("*")) {
                    differenceString = "* +" + (rightRating - leftRating);
                } else {
                    differenceString = "+" + (rightRating - leftRating);
                }

                return `<pre class="comparison-positive">${differenceString}</pre>`;
            } else {
                let differenceString: string;
                if (leftItem.ratingString.includes("*") || rightItem.ratingString.includes("*")) {
                    differenceString = "* -" + (leftRating - rightRating);
                } else {
                    differenceString = "-" + (leftRating - rightRating);
                }

                return `<pre class="comparison-negative">${differenceString}</pre>`;
            }
        }

        // Do Overview comparison
        let html = `
            <div class="part-art-image-container"></div>
            <pre class="comparison-neutral details-part-image-title mt-2">
    
</pre>
            <pre class="details-summary">Comparison</pre>
            ${emptyLine}
            ${emptyLine}
            ${emptyLine}
            ${compareHighBadStat(leftItem.mass ?? 0, rightItem.mass ?? 0)}
            ${compareRating(leftItem, rightItem)}
            ${compareHighGoodStat(leftItem.integrity, rightItem.integrity)}
            ${compareHighGoodStat(leftItem.coverage ?? 0, rightItem.coverage ?? 0)}
            ${emptyLine}
            ${emptyLine}
            ${emptyLine}
        `;

        // Add upkeep if applicable
        if (
            (leftItem.slot === "Power" || leftItem.slot === "Propulsion" || leftItem.slot === "Utility") &&
            (rightItem.slot === "Power" || rightItem.slot === "Propulsion" || rightItem.slot === "Utility")
        ) {
            const leftUpkeep = leftItem as ItemWithUpkeep;
            const rightUpkeep = rightItem as ItemWithUpkeep;

            html += `
                ${emptyLine}
                ${compareHighBadStat(leftUpkeep.energyUpkeep ?? 0, rightUpkeep.energyUpkeep ?? 0)}
                ${compareHighBadStat(leftUpkeep.matterUpkeep ?? 0, rightUpkeep.matterUpkeep ?? 0)}
                ${compareHighBadStat(leftUpkeep.heatGeneration ?? 0, rightUpkeep.heatGeneration ?? 0)}
                ${emptyLine}
            `;
        }

        // Add power generation stats if applicable
        if (leftItem.slot === "Power" && rightItem.slot === "Power") {
            const leftPower = leftItem as PowerItem;
            const rightPower = rightItem as PowerItem;

            html += `
                ${emptyLine}
                ${compareHighGoodStat(leftPower.energyGeneration ?? 0, rightPower.energyGeneration ?? 0)}
                ${compareHighGoodStat(leftPower.energyStorage ?? 0, rightPower.energyStorage ?? 0)}
                ${compareHighGoodStat(leftPower.powerStability ?? 100, rightPower.powerStability ?? 100)}
            `;
        }

        // Add propulsion stats if applicable
        if (leftItem.slot === "Propulsion" && rightItem.slot === "Propulsion") {
            const leftPropulsion = leftItem as PropulsionItem;
            const rightPropulsion = rightItem as PropulsionItem;

            function getDragOrModHtml(leftPropulsion: PropulsionItem, rightPropulsion: PropulsionItem) {
                if (leftPropulsion.modPerExtra !== undefined && rightPropulsion.modPerExtra !== undefined) {
                    return compareHighBadStat(leftPropulsion.modPerExtra, rightPropulsion.modPerExtra);
                } else if (leftPropulsion.drag !== undefined && rightPropulsion.drag !== undefined) {
                    return compareHighBadStat(leftPropulsion.drag, rightPropulsion.drag);
                } else {
                    return emptyLine;
                }
            }

            function getBurnoutOrSiegeHtml(leftPropulsion: PropulsionItem, rightPropulsion: PropulsionItem) {
                if (leftPropulsion.burnout !== undefined || rightPropulsion.burnout !== undefined) {
                    return compareHighBadStat(
                        parseIntOrDefault(leftPropulsion.burnout as string, 0),
                        parseIntOrDefault(rightPropulsion.burnout as string, 0),
                    );
                } else if (leftPropulsion.type === ItemType.Treads && rightPropulsion.type === ItemType.Treads) {
                    if (leftPropulsion.siege === rightPropulsion.siege) {
                        return emptyLine;
                    } else if (leftPropulsion.siege === SiegeMode.High) {
                        return '<pre class="comparison-negative">High</pre>';
                    } else if (leftPropulsion.siege === SiegeMode.Standard && rightPropulsion.siege === undefined) {
                        return '<pre class="comparison-negative">Standard</pre>';
                    } else if (leftPropulsion.siege === undefined) {
                        return '<pre class="comparison-positive">N/A</pre>';
                    } else {
                        return '<pre class="comparison-positive">Standard</pre>';
                    }
                }

                return emptyLine;
            }

            html += `
                ${emptyLine}
                ${compareHighBadStat(leftPropulsion.timePerMove, rightPropulsion.timePerMove)}
                ${getDragOrModHtml(leftPropulsion, rightPropulsion)}
                ${compareHighBadStat(leftPropulsion.energyPerMove ?? 0, rightPropulsion.energyPerMove ?? 0)}
                ${compareHighBadStat(leftPropulsion.heatPerMove ?? 0, rightPropulsion.heatPerMove ?? 0)}
                ${compareHighGoodStat(leftPropulsion.support, rightPropulsion.support)}
                ${compareHighBadStat(leftPropulsion.penalty, rightPropulsion.penalty)}
                ${getBurnoutOrSiegeHtml(leftPropulsion, rightPropulsion)}
            `;
        }

        function getCriticalHtml(leftWeapon: WeaponItem, rightWeapon: WeaponItem) {
            if (
                leftWeapon.critical === undefined ||
                rightWeapon.critical === undefined ||
                leftWeapon.criticalType === rightWeapon.criticalType
            ) {
                return compareHighGoodStat(leftWeapon.critical ?? 0, rightWeapon.critical ?? 0);
            }

            let leftValue: string;
            switch (leftWeapon.criticalType) {
                case Critical.Blast:
                    leftValue = "(Blast)";
                    break;
                case Critical.Burn:
                    leftValue = "(Burn)";
                    break;
                case Critical.Corrupt:
                    leftValue = "(Corrup)";
                    break;
                case Critical.Destroy:
                    leftValue = "(Destro)";
                    break;
                case Critical.Detonate:
                    leftValue = "(Detona)";
                    break;
                case Critical.Impale:
                    leftValue = "(Impale)";
                    break;
                case Critical.Intensify:
                    leftValue = "(Intens)";
                    break;
                case Critical.Meltdown:
                    leftValue = "(Meltdo)";
                    break;
                case Critical.Phase:
                    leftValue = "(Phase)";
                    break;
                case Critical.Sever:
                    leftValue = "(Sever)";
                    break;
                case Critical.Smash:
                    leftValue = "(Smash)";
                    break;
                case Critical.Sunder:
                    leftValue = "(Sunder)";
                    break;
                default:
                    throw "Invalid critical type";
            }

            return `<pre class="comparison-neutral">${leftValue}</pre>`;
        }

        function getDamageHtml(leftWeapon: WeaponItem, rightWeapon: WeaponItem, explosive: boolean) {
            function getDamage(damageString: string | undefined) {
                let damageMin = 0;
                let damageMax = 0;

                if (damageString?.includes("-")) {
                    const split = damageString.split("-");
                    damageMin = parseInt(split[0]);
                    damageMax = parseInt(split[1]);
                } else if (damageString !== undefined) {
                    damageMin = parseInt(damageString);
                    damageMax = damageMin;
                }

                return { average: (damageMax + damageMin) / 2, min: damageMin, max: damageMax };
            }

            let leftDamageString: string;
            let rightDamageString: string;
            if (explosive) {
                leftDamageString = leftWeapon.explosionDamage as string;
                rightDamageString = rightWeapon.explosionDamage as string;
            } else {
                leftDamageString = leftWeapon.damage as string;
                rightDamageString = rightWeapon.damage as string;
            }
            const leftDamage = getDamage(leftDamageString);
            const rightDamage = getDamage(rightDamageString);

            if (leftDamage.average === rightDamage.average) {
                if (leftDamage.min === rightDamage.min) {
                    return emptyLine;
                } else {
                    return `<pre class="comparison-neutral">${leftDamage.min}-${leftDamage.max}</pre>`;
                }
            }

            function getPlusOrMinusString(number: number) {
                if (number > 0) {
                    return "+" + number;
                } else {
                    return number.toString();
                }
            }

            const minDifference = rightDamage.min - leftDamage.min;
            const maxDifference = rightDamage.max - leftDamage.max;
            if (leftDamage.average < rightDamage.average) {
                return `<pre class="comparison-positive">${getPlusOrMinusString(minDifference)}/${getPlusOrMinusString(
                    maxDifference,
                )}</pre>`;
            } else {
                return `<pre class="comparison-negative">${getPlusOrMinusString(minDifference)}/${getPlusOrMinusString(
                    maxDifference,
                )}</pre>`;
            }
        }

        function getDamageTypeHtml(leftWeapon: WeaponItem, rightWeapon: WeaponItem, explosive: boolean) {
            if (explosive) {
                if (leftWeapon.explosionType === rightWeapon.explosionType || leftWeapon.explosionType === undefined) {
                    return emptyLine;
                }
            } else {
                if (leftWeapon.damageType === rightWeapon.damageType || leftWeapon.damageType === undefined) {
                    return emptyLine;
                }
            }

            function getTypeString(damageType: DamageType) {
                switch (damageType) {
                    case DamageType.Electromagnetic:
                        return "EM";
                    case DamageType.Entropic:
                        return "EN";
                    case DamageType.Explosive:
                        return "EX";
                    case DamageType.Impact:
                        return "I";
                    case DamageType.Kinetic:
                        return "KI";
                    case DamageType.Phasic:
                        return "PH";
                    case DamageType.Piercing:
                        return "P";
                    case DamageType.Slashing:
                        return "S";
                    case DamageType.Thermal:
                        return "TH";
                }

                return "";
            }

            return `<pre class="comparison-neutral">(${getTypeString(
                explosive ? (leftWeapon.explosionType as DamageType) : (leftWeapon.damageType as DamageType),
            )})</pre>`;
        }

        // Add weapon stats if applicable
        if (leftItem.slot === "Weapon" && rightItem.slot === "Weapon") {
            const leftWeapon = leftItem as WeaponItem;
            const rightWeapon = rightItem as WeaponItem;

            function isMelee(item: WeaponItem) {
                return (
                    item.type === ItemType.SlashingWeapon ||
                    item.type === ItemType.ImpactWeapon ||
                    item.type === ItemType.PiercingWeapon ||
                    item.type === ItemType.SpecialMeleeWeapon
                );
            }

            function isRangedNonLauncher(item: WeaponItem) {
                return (
                    item.type === ItemType.BallisticGun ||
                    item.type === ItemType.EnergyGun ||
                    item.type === ItemType.BallisticCannon ||
                    item.type === ItemType.EnergyCannon ||
                    item.type === ItemType.SpecialWeapon
                );
            }

            function isRanged(item: WeaponItem) {
                return isRangedNonLauncher(item) || item.type === ItemType.Launcher;
            }

            // Add melee stats if applicable
            if (isMelee(leftWeapon) && isMelee(rightWeapon)) {
                html += `
                ${emptyLine}
                    ${compareHighBadStat(leftWeapon.shotEnergy ?? 0, rightWeapon.shotEnergy ?? 0)}
                    ${compareHighBadStat(leftWeapon.shotMatter ?? 0, rightWeapon.shotMatter ?? 0)}
                    ${compareHighBadStat(leftWeapon.shotHeat ?? 0, rightWeapon.shotHeat ?? 0)}
                    ${compareHighGoodStat(leftWeapon.targeting ?? 0, rightWeapon.targeting ?? 0)}
                    ${compareHighBadStat(leftWeapon.delay ?? 0, rightWeapon.delay ?? 0)}
                    ${emptyLine}
                `;

                // Add melee damage if applicable
                if (leftWeapon.damage !== undefined && rightWeapon.damage !== undefined) {
                    html += `
                        ${emptyLine}
                        ${getDamageHtml(leftWeapon, rightWeapon, false)}
                        ${getDamageTypeHtml(leftWeapon, rightWeapon, false)}
                        ${getCriticalHtml(leftWeapon, rightWeapon)}
                        ${compareHighGoodStat(leftWeapon.disruption ?? 0, rightWeapon.disruption ?? 0)}
                        ${compareHighGoodStat(leftWeapon.salvage ?? 0, rightWeapon.salvage ?? 0)}
                        ${emptyLine}
                    `;
                }
            }
            // Add ranged weapons if applicable
            else if (isRanged(leftWeapon) && isRanged(rightWeapon)) {
                function getArcOrWaypointsHtml(leftWeapon: WeaponItem, rightWeapon: WeaponItem) {
                    if (rightWeapon.waypoints !== undefined) {
                        return compareHighGoodStat(
                            parseIntOrDefault(leftWeapon.waypoints, 0),
                            parseInt(rightWeapon.waypoints),
                        );
                    } else {
                        return compareHighBadStat(leftWeapon.arc ?? 0, rightWeapon.arc ?? 0);
                    }
                }

                html += `
                    ${emptyLine}
                    ${compareHighGoodStat(leftWeapon.range ?? 0, rightWeapon.range ?? 0)}
                    ${compareHighBadStat(leftWeapon.shotEnergy ?? 0, rightWeapon.shotEnergy ?? 0)}
                    ${compareHighBadStat(leftWeapon.shotMatter ?? 0, rightWeapon.shotMatter ?? 0)}
                    ${compareHighBadStat(leftWeapon.shotHeat ?? 0, rightWeapon.shotHeat ?? 0)}
                    ${compareHighBadStat(leftWeapon.recoil ?? 0, rightWeapon.recoil ?? 0)}
                    ${compareHighGoodStat(leftWeapon.targeting ?? 0, rightWeapon.targeting ?? 0)}
                    ${compareHighBadStat(leftWeapon.delay ?? 0, rightWeapon.delay ?? 0)}
                    ${compareHighGoodStat(leftWeapon.overloadStability ?? 100, rightWeapon.overloadStability ?? 100)}
                    ${getArcOrWaypointsHtml(leftWeapon, rightWeapon)}
                    ${emptyLine}
                `;

                function getPenetrationHtml(leftWeapon: WeaponItem, rightWeapon: WeaponItem) {
                    if (leftWeapon.penetration === "Unlimited") {
                        if (rightWeapon.penetration === "Unlimited") {
                            return emptyLine;
                        }

                        return `<pre class="comparison-negative">-Inf.</pre>`;
                    } else if (rightWeapon.penetration === "Unlimited") {
                        return `<pre class="comparison-positive">+Inf.</pre>`;
                    }

                    function getPenetrationValue(penetrationString: string | undefined) {
                        if (penetrationString === undefined) {
                            return 0;
                        } else {
                            return penetrationString.split("/").length;
                        }
                    }

                    const leftPenetration = getPenetrationValue(leftWeapon.penetration);
                    const rightPenetration = getPenetrationValue(rightWeapon.penetration);
                    return compareHighGoodStat(leftPenetration, rightPenetration);
                }

                function getSpectrumOrHeatTransferHtml(
                    leftWeapon: WeaponItem,
                    rightWeapon: WeaponItem,
                    explosive: boolean,
                ) {
                    function getSpectrumValue(spectrum: Spectrum | undefined) {
                        if (spectrum === Spectrum.Fine) {
                            return 100;
                        } else if (spectrum === Spectrum.Narrow) {
                            return 50;
                        } else if (spectrum === Spectrum.Intermediate) {
                            return 30;
                        } else if (spectrum === Spectrum.Wide) {
                            return 10;
                        } else {
                            return 0;
                        }
                    }

                    function getHeatTransferValue(heatTransfer: HeatTransfer | undefined) {
                        if (heatTransfer === HeatTransfer.Minimal) {
                            return 5;
                        } else if (heatTransfer === HeatTransfer.Low) {
                            return 25;
                        } else if (heatTransfer === HeatTransfer.Medium) {
                            return 37;
                        } else if (heatTransfer === HeatTransfer.High) {
                            return 50;
                        } else if (heatTransfer === HeatTransfer.Massive) {
                            return 80;
                        } else {
                            return 0;
                        }
                    }

                    const rightHeatTransfer = explosive
                        ? getHeatTransferValue(rightWeapon.explosionHeatTransfer)
                        : getHeatTransferValue(rightWeapon.heatTransfer);

                    // Heat transfer has priority if set on the right weapon
                    // Otherwise show spectrum only
                    let html: string;
                    if (rightHeatTransfer != 0) {
                        const leftHeatTransfer = explosive
                            ? getHeatTransferValue(leftWeapon.explosionHeatTransfer)
                            : getHeatTransferValue(leftWeapon.heatTransfer);
                        html = compareNeutralStat(leftHeatTransfer, rightHeatTransfer);
                    } else {
                        const leftSpectrum = explosive
                            ? getSpectrumValue(leftWeapon.explosionSpectrum)
                            : getSpectrumValue(leftWeapon.spectrum);
                        const rightSpectrum = explosive
                            ? getSpectrumValue(rightWeapon.explosionSpectrum)
                            : getSpectrumValue(rightWeapon.spectrum);

                        html = compareNeutralStat(leftSpectrum, rightSpectrum);
                    }

                    return html;
                }

                // Add non-launcher damage if applicable
                if (
                    isRangedNonLauncher(leftWeapon) &&
                    isRangedNonLauncher(rightWeapon) &&
                    leftWeapon.damage !== undefined &&
                    rightWeapon.damage !== undefined
                ) {
                    html += `
                        ${compareHighGoodStat(leftWeapon.projectileCount, rightWeapon.projectileCount)}
                        ${getDamageHtml(leftWeapon, rightWeapon, false)}
                        ${getDamageTypeHtml(leftWeapon, rightWeapon, false)}
                        ${getCriticalHtml(leftWeapon, rightWeapon)}
                        ${getPenetrationHtml(leftWeapon, rightWeapon)}
                        ${getSpectrumOrHeatTransferHtml(leftWeapon, rightWeapon, false)}
                        ${compareHighGoodStat(leftWeapon.disruption ?? 0, rightWeapon.disruption ?? 0)}
                        ${compareHighGoodStat(leftWeapon.salvage ?? 0, rightWeapon.salvage ?? 0)}
                        ${emptyLine}
                    `;
                }
                // Add launcher damage if applicable
                else if (leftWeapon.type === ItemType.Launcher && rightWeapon.type === ItemType.Launcher) {
                    html += `
                        ${compareHighGoodStat(leftWeapon.projectileCount, rightWeapon.projectileCount)}
                        ${compareHighGoodStat(leftWeapon.explosionRadius ?? 0, rightWeapon.explosionRadius ?? 0)}
                        ${getDamageHtml(leftWeapon, rightWeapon, true)}
                        ${compareHighBadStat(
                            parseIntOrDefault(leftWeapon.falloff, 0),
                            parseIntOrDefault(rightWeapon.falloff, 0),
                        )}
                        ${getDamageTypeHtml(leftWeapon, rightWeapon, true)}
                        ${getSpectrumOrHeatTransferHtml(leftWeapon, rightWeapon, true)}
                        ${compareHighGoodStat(
                            leftWeapon.explosionDisruption ?? 0,
                            rightWeapon.explosionDisruption ?? 0,
                        )}
                        ${compareHighGoodStat(
                            parseIntOrDefault(leftWeapon.explosionSalvage, 0),
                            parseIntOrDefault(rightWeapon.explosionSalvage, 0),
                        )}                        ${emptyLine}
                    `;
                }
            }
        }

        return html;
    }

    // Creates elements for simple items on page load
    function createSimpleItems() {
        // Clear old items
        ($('#simpleItemsGrid > [data-toggle="popover"]') as any).popover("dispose");
        $("#simpleItemsGrid").empty();

        // Create simple grid items
        const itemNames = Object.keys(itemData);
        const itemsGrid = $("#simpleItemsGrid");
        itemNames.forEach((itemName) => {
            const item = itemData[itemName];
            const itemId = nameToId(itemName);
            const element = $(
                `<button
                    id="${itemId}"
                    class="item btn"
                    type="button"
                    data-toggle="popover">
                    ${itemName}
                 </button>`,
            );

            // Delay generation and init of the item popover until
            // it is clicked on unless forcing all HTML gen
            if (generateAllHtml) {
                element.data("html", true);
                element.data("content", createItemDataContent(item));
                (element as any).popover({ sanitize: false });
            } else {
                element.on("click", () => {
                    if (element.data("html") !== undefined) {
                        return;
                    }

                    ($('[data-toggle="popover"]') as any).popover("hide");

                    element.data("html", true);
                    element.data("content", createItemDataContent(item));
                    (element as any).popover({ sanitize: false });
                    element.trigger("click");
                });
            }

            simpleItemElements[itemName] = element;
            itemsGrid.append(element[0]);
        });

        // Create comparison selections
        itemNames.sort(gallerySort);
        const selects = [$("#leftPartSelect"), $("#rightPartSelect")];
        selects.forEach((select) => {
            select.empty();
            itemNames.forEach((itemName) => {
                select.append(`<option>${itemName}</option>`);
            });

            refreshSelectpicker(select);
        });
        selects[0].selectpicker("val", "Lgt. Assault Rifle");
        selects[1].selectpicker("val", "Hvy. Assault Rifle");
    }

    // Creates elements for all gallery items
    function createGalleryItems() {
        function createImage(item: Item) {
            // If generating all HTML then use a normal image to force the load
            // Normally use the lazily-loaded image for performance
            if (generateAllHtml) {
                return `<img src=${escapeHtml(getItemAsciiArtImageName(item))}"/>`;
            } else {
                return `<img class="lozad" data-src="${escapeHtml(getItemAsciiArtImageName(item))}"/>`;
            }
        }

        ($('#galleryGrid > [data-toggle="popover"]') as any).popover("dispose");
        $("#galleryGrid").empty();

        const galleryGrid = $("#galleryGrid");
        const itemNames = Object.keys(itemData);
        itemNames.forEach((itemName) => {
            const item = itemData[itemName];
            const itemId = nameToId(itemName);
            const element = $(
                `<button
                    id=${itemId}
                    class="gallery-item btn btn-no-background-hover"
                    type="button"
                    data-toggle="popover">
                    <span>${itemName}</span>
                    ${createImage(item)}
                </button>`,
            );

            // Delay generation and init of the item popover until
            // it is clicked on unless forcing all HTML gen
            if (generateAllHtml) {
                element.data("html", true);
                element.data("content", createItemDataContent(item));
                (element as any).popover({ sanitize: false });
            } else {
                element
                    .find("*")
                    .addBack()
                    .on("click", () => {
                        if (element.data("html") !== undefined) {
                            return;
                        }

                        ($('[data-toggle="popover"]') as any).popover("hide");

                        element.data("html", true);
                        element.data("content", createItemDataContent(item));
                        (element as any).popover({ sanitize: false });
                        element.trigger("toggle");
                    });
            }

            galleryItemElements[itemName] = element;
            galleryGrid.append(element[0]);
        });
    }

    // Creates elements for all spreadsheet items
    function createSpreadsheetItems() {
        if (getViewMode() !== "Spreadsheet") {
            // No need to calculate if not in spreadsheet mode
            return;
        }

        // Clear old items
        const table = $("#spreadsheetItemsTable");
        table.trigger("destroy");
        // ($('#spreadsheetItemsTable [data-toggle="popover"]') as any).popover("dispose");
        table.empty();

        // Create spreadsheet header elements first
        const slotId = getSelectedButtonId($("#slotsContainer"));
        if (!(slotId in slotMap)) {
            // No items to create - slot must be chosen first
            return;
        }
        const itemSlot = slotMap[slotId] as ItemSlot;
        const lookup = slotCategories[itemSlot];
        const tableHeader = $("<thead></thead>");
        const tableHeaderRow = $("<tr></tr>");

        // The first header row contains the category groupings
        tableHeader.append(tableHeaderRow[0]);
        table.append(tableHeader[0]);
        Object.keys(lookup).forEach((categoryName) => {
            tableHeaderRow.append(`<th colspan=${lookup[categoryName].length}>${categoryName}</th>`);
        });

        // The second header row contains all the category names
        const nameRow = $("<tr></tr>");
        tableHeader.append(nameRow[0]);
        Object.keys(lookup).forEach((categoryName) => {
            lookup[categoryName].forEach((category) => {
                nameRow.append(`<th>${category.name}</th>`);
            });
        });

        // Then create the body
        const tableBody = $("<tbody></tbody>");
        table.append(tableBody[0]);

        // Subsequent rows contain info about each part
        const itemNames = Object.keys(itemData);
        itemNames.forEach((itemName) => {
            const item = itemData[itemName];
            const row = $("<tr></tr>");

            if (item.slot !== itemSlot) {
                return;
            }

            Object.keys(lookup).forEach((categoryName) => {
                const categoryList = lookup[categoryName];
                categoryList.forEach((category) => {
                    let value: any = undefined;
                    if (category.propertyName !== undefined) {
                        // If explicit property name given then use that
                        value = item[category.propertyName];
                    } else if (category.propertyNames !== undefined) {
                        // If multiple names then use them in sequence
                        value = item[category.propertyNames[0]];
                        for (let i = 1; i < category.propertyNames.length; i++) {
                            if (value !== undefined) {
                                value = value[category.propertyNames[i]];
                            }
                        }
                    } else {
                        // No property name, default to the category name lowercase'd
                        value = item[category.name.toLowerCase()];
                    }

                    const cellValue = value === undefined ? "" : value.toString();
                    row.append(`<td>${cellValue}</td>`);
                });
            });

            spreadsheetItemElements[itemName] = row;
            table.append(row[0]);
        });

        // Assign special sorters
        const textSorter: MappedSettings<TextSorter> = {};
        const headers: { [index: number]: TablesorterHeading } = {};
        let columnIndex = 0;
        Object.keys(lookup).forEach((categoryName) => {
            const categoryList = lookup[categoryName];
            categoryList.forEach((category) => {
                if (category.sorter !== undefined) {
                    headers[columnIndex] = { sorter: "text" };
                    textSorter[columnIndex] = category.sorter;
                }

                columnIndex += 1;
            });
        });

        table.tablesorter({
            selectorHeaders: "> thead > tr:nth-child(2) > th",
            headers: headers,
            textSorter: textSorter,
        });
    }

    // Gets a filter function combining all current filters
    function getItemFilter() {
        const filters: ((item: Item) => boolean)[] = [];

        // Spoilers filter
        const spoilersState = getSpoilerState();
        if (spoilersState === "None") {
            filters.push((item) => item.spoiler === "None");
        } else if (spoilersState === "Spoiler") {
            filters.push((item) => item.spoiler !== "Redacted");
        }

        // Name filter
        const nameValue = ($("#name").val() as string).toLowerCase();
        if (nameValue.length > 1) {
            // Only add a leetspeak convert if > 1 letter to reduce chance of
            // false positives on the translation
            // 2 min works well as it will catch somebody typing in the first half
            // of a bot name, like BR for 8R-AWN
            filters.push((item) => {
                const lowerName = item.name.toLowerCase();
                return leetSpeakMatchTransform(lowerName).includes(nameValue) || lowerName.includes(nameValue);
            });
        } else if (nameValue.length > 0) {
            filters.push((item) => item.name.toLowerCase().includes(nameValue));
        }

        // Effect/Description filter
        const effectValue = ($("#effect").val() as string).toLowerCase();
        if (effectValue.length > 0) {
            filters.push((item) => {
                if (item.effect?.toLowerCase().includes(effectValue)) {
                    return true;
                } else if (item.description?.toLowerCase().includes(effectValue)) {
                    return true;
                }

                return false;
            });
        }

        // Rating filter
        let ratingValue = $("#rating").val() as string;
        if (ratingValue.length > 0) {
            const includeAbove = ratingValue.slice(-1) === "+";
            const includeBelow = ratingValue.slice(-1) === "-";
            ratingValue = ratingValue.replace("+", "").replace("-", "");

            let floatRatingValue;
            if (ratingValue.slice(-1) === "*") {
                floatRatingValue = parseFloat(ratingValue.slice(0, ratingValue.lastIndexOf("*"))) + 0.5;
            } else {
                floatRatingValue = parseFloat(ratingValue);
            }

            // A + at the end means also include values above the given value
            // A - means include values below
            if (includeAbove) {
                filters.push((item) => item.rating >= floatRatingValue);
            } else if (includeBelow) {
                filters.push((item) => item.rating <= floatRatingValue);
            } else if (ratingValue === "*") {
                filters.push((item) => item.ratingString.includes("*"));
            } else {
                filters.push((item) => item.rating == floatRatingValue);
            }
        }

        // Size filter
        let sizeValue = $("#size").val() as string;
        if (sizeValue.length > 0) {
            const includeAbove = sizeValue.slice(-1) === "+";
            const includeBelow = sizeValue.slice(-1) === "-";
            sizeValue = sizeValue.replace("+", "").replace("-", "");

            const intSizeValue = parseInt(sizeValue);

            // A + at the end means also include values above the given value
            // A - means include values below
            if (includeAbove) {
                filters.push((item) => item.size >= intSizeValue);
            } else if (includeBelow) {
                filters.push((item) => item.size <= intSizeValue);
            } else {
                filters.push((item) => item.size == intSizeValue);
            }
        }

        // Mass filter
        let massValue = $("#mass").val() as string;
        if (massValue.length > 0) {
            const includeAbove = massValue.slice(-1) === "+";
            const includeBelow = massValue.slice(-1) === "-";
            massValue = massValue.replace("+", "").replace("-", "");

            const intMassValue = parseInt(massValue);

            // A + at the end means also include values above the given value
            // A - means include values below
            if (includeAbove) {
                filters.push((item) => item.mass !== undefined && item.mass >= intMassValue);
            } else if (includeBelow) {
                filters.push((item) => item.mass !== undefined && item.mass <= intMassValue);
            } else {
                filters.push((item) => item.mass !== undefined && item.mass == intMassValue);
            }
        }

        // Schematic filter
        const depthValue = $("#depth").val() as string;
        if (depthValue.length > 0) {
            const depthNum = Math.abs(parseInt(depthValue));

            if (!Number.isNaN(depthNum)) {
                const terminalModifier = terminalLevelMap[getSelectedButtonId($("#schematicsContainer"))];
                const hackLevel = 10 - depthNum + terminalModifier;

                filters.push((item) => {
                    if (!item.hackable) {
                        return false;
                    }

                    return hackLevel >= Math.ceil(item.rating);
                });
            }
        }

        // Slot filter
        const slotId = getSelectedButtonId($("#slotsContainer"));
        if (slotId in slotMap) {
            const filterSlot = slotMap[slotId];
            filters.push((item) => item.slot === filterSlot);
        }

        // Type filter
        const typeId = getSelectedButtonId($('#typeFilters > div:not(".not-visible")'));
        if (typeId in typeMap) {
            const filterType = typeMap[typeId];
            filters.push((item) => item.type === filterType);
        }

        // Category filter
        const categoryId = getSelectedButtonId($("#categoryContainer")) as CategoryId;
        if (categoryIdToCategoryMap.has(categoryId)) {
            const category = categoryIdToCategoryMap.get(categoryId)!;
            filters.push((item) => item.categories.includes(category));
        }

        // Create a function that checks all filters
        return (item) => {
            return filters.every((func) => func(item));
        };
    }

    // Gets the active view mode
    function getViewMode(): ViewMode {
        const modeId = getSelectedButtonId($("#modeContainer"));

        if (modeId === "modeComparison") {
            return "Comparison";
        } else if (modeId === "modeSpreadsheet") {
            return "Spreadsheet";
        } else if (modeId === "modeGallery") {
            return "Gallery";
        }

        return "Simple";
    }

    // Initialize the page state
    async function init() {
        // Reintate for beta 12
        // const isB11 = getB11State();
        try {
            await initData(items as any, undefined);
        } catch (ex) {
            console.log(ex);
        }

        createHeader("Parts", $("#headerContainer"));
        // $("#beta11Checkbox").prop("checked", getB11State());
        resetButtonGroup($("#modeContainer"));
        registerDisableAutocomplete($(document));

        // Initialize page state
        createSimpleItems();
        createGalleryItems();
        createSpreadsheetItems();
        updateCategoryVisibility();
        resetFilters();
        updateComparison();

        // Load spoilers saved state
        $("#spoilers").text(getSpoilerState());

        // Init lazy loading for gallery images
        const observer = lozad();
        observer.observe();

        // Register handlers
        $("#spoilerDropdown > button").on("click", (e) => {
            const state = $(e.target).text();
            $("#spoilers").text(state);
            setSpoilerState(state);
            ($("#spoilerDropdown > button") as any).tooltip("hide");
            updateCategoryVisibility();
            updateItems();
        });
        $("#name").on("input", updateItems);
        $("#effect").on("input", updateItems);
        $("#modeContainer > label > input").on("change", (e) => {
            // Tooltips on buttons need to be explicitly hidden on press
            ($(e.target).parent() as any).tooltip("hide");
            createSpreadsheetItems();
            updateItems();
        });
        $("#depth").on("input", updateItems);
        $("#rating").on("input", updateItems);
        $("#size").on("input", updateItems);
        $("#mass").on("input", updateItems);
        $("#reset").on("click", () => {
            ($("#reset") as any).tooltip("hide");
            resetFilters();
        });
        $("#slotsContainer > label > input").on("change", () => {
            createSpreadsheetItems();
            updateTypeFilters();
            updateItems();
        });
        $("#schematicsContainer > label > input").on("change", updateItems);
        $("#powerTypeContainer > label > input").on("change", updateItems);
        $("#propTypeContainer > label > input").on("change", updateItems);
        $("#utilTypeContainer > label > input").on("change", updateItems);
        $("#weaponTypeContainer > label > input").on("change", updateItems);
        $("#categoryContainer > label > input").on("change", (e) => {
            // Tooltips on buttons need to be explicitly hidden on press
            ($(e.target).parent() as any).tooltip("hide");
            updateItems();
        });
        $("#sortingContainer > div > button").on("click", () => {
            // Hide popovers when clicking a sort button
            ($('[data-toggle="popover"]') as any).popover("hide");
        });
        $("#primarySortDropdown > button").on("click", (e) => {
            const targetText = $(e.target).text();
            $("#primarySort").text(targetText);

            // Reset some settings based on the primary filter choice
            if (targetText === "Alphabetical" || targetText === "Gallery") {
                $("#secondarySort").text("None");
                $("#secondarySortDirection").text("Ascending");
            } else {
                $("#secondarySort").text("Alphabetical");
                $("#secondarySortDirection").text("Ascending");
            }
            updateItems();
        });
        $("#primarySortDirectionDropdown > button").on("click", (e) => {
            $("#primarySortDirection").text($(e.target).text());
            updateItems();
        });
        $("#secondarySortDropdown > button").on("click", (e) => {
            $("#secondarySort").text($(e.target).text());
            updateItems();
        });
        $("#secondarySortDirectionDropdown > button").on("click", (e) => {
            $("#secondarySortDirection").text($(e.target).text());
            updateItems();
        });
        $("#leftPartSelect").on("changed.bs.select", () => {
            updateComparison();
        });
        $("#rightPartSelect").on("changed.bs.select", () => {
            updateComparison();
        });
        $("#comparisonSwap").on("click", () => {
            const leftPicker = $("#leftPartSelect");
            const rightPicker = $("#rightPartSelect");
            const leftValue = leftPicker.selectpicker("val") as any as string;
            const rightValue = rightPicker.selectpicker("val") as any as string;

            leftPicker.selectpicker("val", rightValue);
            rightPicker.selectpicker("val", leftValue);
        });

        // Reinstate for beta 12
        // $("#beta11Checkbox").on("change", () => {
        //     const isB11 = $("#beta11Checkbox").prop("checked");
        //     setB11State(isB11);
        //     const newItems = items;

        //     initData(newItems as any, undefined);

        //     // Initialize page state
        //     createSimpleItems();
        //     createSpreadsheetItems();
        //     updateCategoryVisibility();
        //     resetFilters();

        //     ($("#beta11Checkbox").parent() as any).tooltip("hide");
        // });

        $(window).on("click", (e) => {
            // If clicking outside of a popover close the current one
            const targetPopover = $(e.target).parents(".popover").length != 0;
            const targetUnderPopoverButton = $(e.target).parents("[data-toggle='popover']").length != 0;

            if (targetPopover) {
                $(e.target).trigger("blur");
                return;
            }

            let target = e.target;
            if (targetUnderPopoverButton) {
                target = $(e.target).parents("[data-toggle='popover']")[0] as any;
            }

            if ($(".popover").length >= 1) {
                ($("[data-toggle='popover']") as any).not(target).popover("hide");
            }
        });

        // These divs are created at runtime so have to do this at init
        $("#leftPartSelectContainer > div").addClass("part-dropdown");
        $("#leftPartSelectContainer > div > .dropdown-menu").addClass("part-dropdown-menu");
        $("#rightPartSelectContainer > div").addClass("part-dropdown");
        $("#rightPartSelectContainer > div > .dropdown-menu").addClass("part-dropdown-menu");

        // Minor hack, the btn-light class is auto-added to dropdowns with search
        // but it doesn't really fit with everything else
        $(".btn-light").removeClass("btn-light");

        // Enable tooltips
        ($('[data-toggle="tooltip"]') as any).tooltip();
    }

    // Resets all filters
    function resetFilters() {
        // Reset text inputs
        $("#name").val("");
        $("#effect").val("");
        $("#depth").val("");
        $("#rating").val("");
        $("#size").val("");
        $("#mass").val("");

        // Reset buttons
        resetButtonGroup($("#schematicsContainer"));
        resetButtonGroup($("#slotsContainer"));
        resetButtonGroup($("#powerTypeContainer"));
        resetButtonGroup($("#propTypeContainer"));
        resetButtonGroup($("#utilTypeContainer"));
        resetButtonGroup($("#weaponTypeContainer"));
        resetButtonGroup($("#categoryContainer"));

        // Reset sort
        $("#primarySort").text("Alphabetical");
        $("#primarySortDirection").text("Ascending");
        $("#secondarySort").text("None");
        $("#secondarySortDirection").text("Ascending");

        // Reset to default items view
        updateTypeFilters();
        updateItems();
    }

    // Sorts the collection of item names based on the sort settings
    function sortItemNames(itemNames: string[]): string[] {
        const sortKeyMap = {
            Alphabetical: { key: "name", sort: alphabeticalSort },
            Gallery: { key: "name", sort: gallerySort },
            Rating: { key: "rating", sort: integerSort },
            Size: { key: "size", sort: integerSort },
            Mass: { key: "mass", sort: integerSort },
            Integrity: { key: "integrity", sort: integerSort },
            Coverage: { key: "coverage", sort: integerSort },
            Arc: { key: "arc", sort: integerSort },
            Critical: { key: "criticalString", sort: criticalSort },
            Damage: { keys: ["damage", "explosionDamage"], sort: damageSort },
            Delay: { key: "delay", sort: integerSort },
            Disruption: { keys: ["disruption", "explosionDisruption"], sort: integerSort },
            Drag: { key: "drag", sort: integerSort },
            "Energy/Move": { key: "energyPerMove", sort: integerSort },
            "Energy Generation": { key: "energyGeneration", sort: integerSort },
            "Energy Storage": { key: "energyStorage", sort: integerSort },
            "Energy Upkeep": { key: "energyUpkeep", sort: integerSort },
            "Explosion Radius": { key: "explosionRadius", sort: integerSort },
            Falloff: { key: "falloff", sort: integerSort },
            "Heat/Move": { key: "heatPerMove", sort: integerSort },
            "Heat Generation": { key: "heatGeneration", sort: integerSort },
            "Heat Transfer": { keys: ["heatTransfer", "explosionHeatTransfer"], sort: heatSort },
            "Matter Upkeep": { key: "matterUpkeep", sort: integerSort },
            Penalty: { key: "penalty", sort: integerSort },
            "Projectile Count": { key: "projectileCount", sort: integerSort },
            Range: { key: "range", sort: integerSort },
            Recoil: { key: "recoil", sort: integerSort },
            Salvage: { keys: ["salvage", "explosionSalvage"], sort: integerSort },
            "Shot Energy": { key: "shotEnergy", sort: integerSort },
            "Shot Heat": { key: "shotHeat", sort: integerSort },
            "Shot Matter": { key: "shotMatter", sort: integerSort },
            Spectrum: { keys: ["spectrum", "explosionSpectrum"], sort: spectrumSort },
            Support: { key: "support", sort: integerSort },
            Targeting: { key: "targeting", sort: integerSort },
            "Time/Move": { key: "timePerMove", sort: integerSort },
            Waypoints: { key: "waypoints", sort: integerSort },
        };

        const viewMode = getViewMode();
        if (viewMode === "Comparison") {
            // Comparison names are pre-sorted, don't need to sort here
            return itemNames;
        }

        // Do initial sort
        const isSpreadsheet = viewMode === "Spreadsheet";
        const primaryObject = isSpreadsheet ? sortKeyMap["Gallery"] : sortKeyMap[$("#primarySort").text()];
        const primaryKeys: string[] = "key" in primaryObject ? [primaryObject.key] : primaryObject.keys;
        const primarySort = primaryObject.sort;
        itemNames.sort((a, b) => {
            const itemA = getItem(a);
            const itemB = getItem(b);

            const aKey = primaryKeys.find((key: string) => key in itemA && itemA[key] !== undefined);
            const bKey = primaryKeys.find((key: string) => key in itemB && itemB[key] !== undefined);

            return primarySort(itemA[aKey!], itemB[bKey!]);
        });

        if (isSpreadsheet) {
            // If in spreadsheet view do an initial gallery sort only
            return itemNames;
        }

        if ($("#primarySortDirection").text().trim() === "Descending") {
            itemNames.reverse();
        }

        // Do secondary sort if selected
        const secondaryObject = sortKeyMap[$("#secondarySort").text()];
        if (secondaryObject === undefined) {
            return itemNames;
        }

        const secondaryKeys = "key" in secondaryObject ? [secondaryObject.key] : secondaryObject.keys;
        const secondarySort = secondaryObject.sort;

        // Group items based on the initial sort
        const groupedItemNames = {};
        const groupedKeys: any[] = [];
        itemNames.forEach((itemName: string) => {
            const item = getItem(itemName);
            const key = primaryKeys.find((key: string) => key in item && item[key] !== undefined);
            const value = item[key!];

            if (value in groupedItemNames) {
                groupedItemNames[value].push(itemName);
            } else {
                groupedItemNames[value] = [itemName];
                groupedKeys.push(value);
            }
        });

        // Sort subgroups
        groupedKeys.forEach((key) => {
            const itemNames = groupedItemNames[key];

            itemNames.sort((a: string, b: string) => {
                const itemA = getItem(a);
                const itemB = getItem(b);

                const aKey = secondaryKeys.find((key: string) => key in itemA);
                const bKey = secondaryKeys.find((key: string) => key in itemB);

                return secondarySort(itemA[aKey], itemB[bKey]);
            });
        });

        // Combine groups back into single sorted array
        const reverseSecondaryGroups = $("#secondarySortDirection").text().trim() === "Descending";
        let newItems: string[] = [];
        groupedKeys.forEach((key) => {
            if (reverseSecondaryGroups) {
                groupedItemNames[key].reverse();
            }

            newItems = newItems.concat(groupedItemNames[key]);
        });

        return newItems;
    }

    // Updates category visibility based on the spoiler state
    function updateCategoryVisibility() {
        const state = getSpoilerState();

        function setInvisible(id: CategoryId) {
            $(`#${id}`).addClass("not-visible");
        }
        function setVisible(id: CategoryId) {
            $(`#${id}`).removeClass("not-visible");
        }

        switch (state) {
            case "None":
                spoilerCategoryIds.forEach(setInvisible);
                redactedCategoryIds.forEach(setInvisible);
                break;
            case "Spoiler":
                spoilerCategoryIds.forEach(setVisible);
                redactedCategoryIds.forEach(setInvisible);
                break;
            case "Redacted":
                spoilerCategoryIds.forEach(setVisible);
                redactedCategoryIds.forEach(setVisible);
                break;
        }
    }

    // Updates the comparison stats for the left/right items
    function updateComparison() {
        const leftContainer = $("#leftPartInfoContainer");
        const leftItemName = $("#leftPartSelect").selectpicker("val") as any as string;
        const rightContainer = $("#rightPartInfoContainer");
        const rightItemName = $("#rightPartSelect").selectpicker("val") as any as string;
        const comparisonInfoContainer = $("#comparisonInfoContainer");

        // Replace both part infoboxes and comparison text
        leftContainer.empty();
        comparisonInfoContainer.empty();
        rightContainer.empty();

        const leftItem = getItem(leftItemName);
        const rightItem = getItem(rightItemName);
        leftContainer.append(createItemDataContent(leftItem));
        comparisonInfoContainer.append(createComparisonDataContent(leftItem, rightItem));
        rightContainer.append(createItemDataContent(rightItem));
    }

    // Clears all existing items and adds new ones based on the filters
    const viewModeVisibilityMap: Map<ViewMode, string[]> = new Map<ViewMode, string[]>([
        ["Comparison", ["#comparisonContainer"]],
        ["Gallery", ["#galleryGrid, #sortingContainer"]],
        ["Simple", ["#sortingContainer", "#simpleItemsGrid"]],
        ["Spreadsheet", ["#spreadsheetItemsTable", "#spreadsheetSlotRequiredLabel"]],
    ]);
    function updateItems() {
        function updateComparisonItems(items: string[]) {
            // Update the comparison select options
            const itemSet = new Set(items);
            const selects = [$("#leftPartSelect"), $("#rightPartSelect")];
            selects.forEach((select) => {
                select.children().each((_, child) => {
                    const item = $(child).val() as string;
                    if (itemSet.has(item)) {
                        $(child).removeClass("not-visible");
                    } else {
                        $(child).addClass("not-visible");
                    }
                });

                refreshSelectpicker(select);
            });
        }

        function updateGalleryItems(items: string[]) {
            // Update visibility and order of all items
            $("#galleryGrid > button").addClass("not-visible");

            let precedingElement = null;
            items.forEach((itemName) => {
                // Update visibility of each element
                const element = galleryItemElements[itemName];

                if (itemsWithNoArt.has(itemName)) {
                    return;
                }
                element.removeClass("not-visible");

                // Must insert elements in-order like this because the sort
                // mode may have changed
                if (precedingElement == null) {
                    $("#galleryGrid").append(element);
                } else {
                    element.insertAfter(precedingElement);
                }

                precedingElement = element;
            });
        }

        function updateSpreadsheetItems(items: string[]) {
            // Update visibility and order of all items
            $("#spreadsheetItemsTable > tbody > tr").addClass("not-visible");

            const slotId = getSelectedButtonId($("#slotsContainer"));
            if (!(slotId in slotMap)) {
                $("#spreadsheetItemsTable").addClass("not-visible");
                return;
            }

            $("#spreadsheetSlotRequiredLabel").addClass("not-visible");

            // Reset visibility of all items
            Object.keys(spreadsheetItemElements).forEach((itemName) => {
                const item = spreadsheetItemElements[itemName];
                item.addClass("not-visible");
            });

            items.forEach((itemName) => {
                // Update visibility of each element
                // Do not re-order the elements here
                // Sorting is controlled by the table not by the sort dropdowns
                // like the simple view
                const element = spreadsheetItemElements[itemName];
                element.removeClass("not-visible");
            });
        }

        // Updates the simple items view with specified item names
        function updateSimpleItems(items: string[]) {
            // Update visibility and order of all items
            $("#simpleItemsGrid > button").addClass("not-visible");

            let precedingElement = null;
            items.forEach((itemName) => {
                // Update visibility of each element
                const element = simpleItemElements[itemName];
                element.removeClass("not-visible");

                // Must insert elements in-order like this because the sort
                // mode may have changed
                if (precedingElement == null) {
                    $("#simpleItemsGrid").append(element);
                } else {
                    element.insertAfter(precedingElement);
                }

                precedingElement = element;
            });
        }

        // Hide any existing popovers
        ($('[data-toggle="popover"]') as any).popover("hide");

        // Get the names of all non-filtered items
        const itemFilter = getItemFilter();
        let items: string[] = [];
        Object.keys(itemData).forEach((itemName) => {
            const item = getItem(itemName);

            if (itemFilter(item)) {
                items.push(item.name);
            }
        });

        // Sort item names for display
        items = sortItemNames(items);

        const selectedViewMode = getViewMode();

        // Show/hide appropriate elements
        // Hide all first, then enable relevant elements later
        for (const viewMode of viewModeVisibilityMap.keys()) {
            for (const selector of viewModeVisibilityMap.get(viewMode)!) {
                $(selector).addClass("not-visible");
            }
        }

        for (const selector of viewModeVisibilityMap.get(selectedViewMode)!) {
            $(selector).removeClass("not-visible");
        }

        if (selectedViewMode === "Simple") {
            updateSimpleItems(items);
        } else if (selectedViewMode === "Comparison") {
            updateComparisonItems(items);
        } else if (selectedViewMode === "Spreadsheet") {
            updateSpreadsheetItems(items);
        } else if (selectedViewMode === "Gallery") {
            updateGalleryItems(items);
        }
    }

    // Updates the type filters visibility based on the selected slot
    function updateTypeFilters() {
        // Hide all type filters
        Object.keys(slotIdToTypeIdMap).forEach((k) => $(`#${slotIdToTypeIdMap[k]}`).addClass("not-visible"));

        const activeSlotId = getSelectedButtonId($("#slotsContainer"));
        if (activeSlotId in slotIdToTypeIdMap) {
            $(`#${slotIdToTypeIdMap[activeSlotId]}`).removeClass("not-visible");
        }
    }
});
