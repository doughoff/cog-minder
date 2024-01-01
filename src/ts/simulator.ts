import "bootstrap";
import "bootstrap-select";
import {
    CategoryScale,
    Chart,
    ChartDataset,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    LinearScaleOptions,
    Point,
    PointElement,
    ScatterController,
    Title,
    Tooltip,
} from "chart.js";
import * as jQuery from "jquery";

import bots from "../json/bots.json";
import items from "../json/items.json";
import { Bot } from "./botTypes";
import {
    getBotDefensiveState,
    getRangedVolleyTime,
    getRecoil,
    getRegen,
    maxVolleys,
    simulateCombat,
    spectrumToNumber,
    volleyTimeMap,
} from "./simulatorCalcs";
import { DumpMindEntity } from "./types/dumpMindTypes";
import {
    Actuator,
    ActuatorArray,
    CombatSuite,
    CoreAnalyzer,
    Critical,
    DamageType,
    Item,
    ItemRatingCategory,
    ItemType,
    LauncherGuidance,
    ParticleCharging,
    PropulsionItem,
    RangedWeaponCycling,
    RecoilReduction,
    SalvageTargeting,
    TargetAnalyzer,
    Targeting,
    WeaponItem,
} from "./types/itemTypes";
import {
    BotBehavior,
    BotState,
    EndCondition,
    ItemLootState,
    LootState,
    OffensiveState,
    SimulatorPart,
    SimulatorState,
    SimulatorWeapon,
    SneakAttackStrategy,
} from "./types/simulatorTypes";
import {
    botData,
    canShowPart,
    canShowSpoiler,
    createBotDataContent,
    createItemDataContent,
    gallerySort,
    getBot,
    getBotOrNull,
    getItem,
    getItemOrNull,
    getItemSpriteImageName,
    hasActiveSpecialProperty,
    initData,
    itemData,
    parseIntOrDefault,
    sum,
    valueOrDefault,
} from "./utilities/common";
import {
    createHeader,
    enablePopoverBotInfoInteraction,
    getSpoilerState,
    refreshSelectpicker,
    registerDisableAutocomplete,
    resetButtonGroup,
    setSpoilerState,
    temporarilySetValue,
} from "./utilities/commonJquery";

Chart.register(
    CategoryScale,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    ScatterController,
    Title,
    Tooltip,
);

const jq = jQuery.noConflict();
jq(function ($) {
    const initialRangedAccuracy = 60;
    const initialMeleeAccuracy = 70;

    const dumpMindTargetName = "DumpMind Target";

    // Chart variables set on init
    let chart: Chart<"scatter">;
    let comparisonChart: Chart<"scatter">;
    let currentComparisonData;

    let savedTargetEntity: DumpMindEntity | undefined = undefined;

    const comparisonBorderColors = [
        "rgba(228, 26, 28, .8)",
        "rgba(55, 126, 184, .8)",
        "rgba(36, 192, 36, .8)",
        "rgba(152, 78, 163, .8)",
        "rgba(255, 127, 0, .8)",
        "rgba(255, 255, 51, .8)",
        "rgba(243, 145, 146, .8)",
        "rgba(145, 187, 222, .8)",
        "rgba(135, 232, 135, .8)",
        "rgba(202, 159, 209, .8)",
        "rgba(255, 194, 133, .8)",
        "rgba(163, 163, 0, .8)",
    ];

    // Array of colors currently used to try to avoid duplicating colors when possible
    const comparisonColorsUsed = comparisonBorderColors.map(() => 0);

    // Flag to cancel a simulation
    let cancelled = false;

    // Armor integrity analyzer chance map
    const armorIntegrityMap = {
        "0%: None": 0,
        "30%: Armor Integrity Analyzer": 30,
        "40%: Imp. Armor Integrity Analyzer": 40,
        "50%: Exp. Armor Integrity Analyzer": 50,
    };

    // Damage reduction names
    const externalDamageReductionNameMap = {
        "0%: None": null,
        "25%: Remote Shield": "Remote Shield",
        "25%: Stasis Trap": "Stasis Trap",
        "50%: Phase Wall": "Phase Wall",
        "50%: Remote Force Field (Energy Mantle)": "Remote Force Field",
        "50%: Stasis Bubble": "Stasis Bubble",
    };

    // Force booster ids
    const forceBoosterIds = ["forceBoosterInput", "impForceBoosterInput", "advForceBoosterInput"];

    // Array of force booster maximum damage increases
    const forceBoosterMaxDamageIncrease = [0.2, 0.3, 0.4];

    // Kinecellerator min damage increase values
    const kinecelleratorMap = {
        "0%: None": 1.0,
        "30%: Kinecellerator": 1.3,
        "40%: Imp. Kinecellerator": 1.4,
        "50%: Adv. Kinecellerator": 1.5,
    };

    // Melee analysis ids
    const meleeAnalysisIds = [
        "meleeAnalysisInput",
        "impMeleeAnalysisInput",
        "advMeleeAnalysisInput",
        "expMeleeAnalysisInput",
    ];

    // Array of melee analysis minimum damage increases
    const meleeAnalysisMinDamageIncrease = [2, 3, 4, 6];

    // Melee weapon types
    const meleeTypes = [
        ItemType.ImpactWeapon,
        ItemType.PiercingWeapon,
        ItemType.SlashingWeapon,
        ItemType.SpecialMeleeWeapon,
    ];

    // Ranged weapon types
    const rangedTypes = [
        ItemType.BallisticCannon,
        ItemType.BallisticGun,
        ItemType.EnergyCannon,
        ItemType.EnergyGun,
        ItemType.Launcher,
        ItemType.SpecialWeapon,
    ];

    // List of weapons affected by the exoskeleton
    const sigixWeapons = [
        "Core Cannon",
        "Core Stripper",
        "Modified Sigix Sheargun",
        "Sigix Broadsword",
        "Sigix Shearcannon",
        "Sigix Sheargun",
    ];

    // Bot size mode to accuracy bonus map
    const sizeAccuracyMap = {
        Huge: 30,
        Large: 10,
        Medium: 0,
        Small: -10,
        Tiny: -30,
    };

    // Siege mode text to accuracy bonus/TUs to activate map
    const siegeModeBonusMap = {
        "No Siege": { bonus: 0, tus: 0 },
        "In Siege Mode": { bonus: 20, tus: 0 },
        "In High Siege Mode": { bonus: 30, tus: 0 },
        "Entering Siege Mode": { bonus: 20, tus: 500 },
        "Entering High Siege Mode": { bonus: 30, tus: 500 },
    };

    $(() => init());

    function addComparison() {
        const name = $("#comparisonNameInput").val() as string;
        $("#comparisonNameInput").val("");

        // Disable the button to avoid adding the dataset multiple times
        const button = $("#addComparisonButton");
        button.addClass("disabled");
        button.prop("disabled", true);
        (button as any).tooltip("hide");

        $("#comparisonContainer").removeClass("not-visible");

        // Try to get the first unused color if possible
        const { colorIndex } = comparisonColorsUsed.reduce(
            (acc, num, index) => {
                if (num < acc.value) {
                    return { colorIndex: index, value: num };
                } else {
                    return acc;
                }
            },
            { colorIndex: -1, value: Number.MAX_VALUE },
        );

        comparisonColorsUsed[colorIndex] += 1;

        // Create and append the dataset to the chart
        const newDataset = getDatasetSettings(name, "rgb(0, 0, 0, 0)", comparisonBorderColors[colorIndex]);
        newDataset.data = currentComparisonData;
        comparisonChart.data.datasets!.push(newDataset);

        // Create editor elements
        const parent = $('<div class="input-group"></div>');
        const nameInput = $(`<input class="form-control" />`);
        nameInput.val(name);
        const deleteButton = $(
            '<button class="btn ml-2" data-toggle="tooltip" title="Removes the dataset.">X</button>',
        );

        parent.append(nameInput[0]);
        parent.append(deleteButton[0]);

        // Set up callbacks
        (deleteButton as any).tooltip();
        deleteButton.on("click", () => {
            // Remove the dataset from the chart
            const datasets = comparisonChart.data.datasets!;
            datasets.splice(datasets.indexOf(newDataset), 1);
            comparisonChart.update();

            if (datasets.length === 0) {
                // Hide the comparison chart section if no more data to show
                $("#comparisonContainer").addClass("not-visible");
            }

            comparisonColorsUsed[colorIndex] -= 1;

            // Remove the associated item
            (deleteButton as any).tooltip("dispose");
            parent.remove();
        });

        nameInput.on("change", () => {
            newDataset.label = nameInput.val() as string;
            comparisonChart.update();
        });

        $("#comparisonDatasetsContainer").append(parent[0]);

        comparisonChart.update();
    }

    // Adds a new weapon select dropdown with an optional weapon name
    function addWeaponSelect(weaponName: string) {
        const spoilersState = getSpoilerState();
        const container = $("#weaponSelectContainer");

        const melee = isMelee();
        const types = melee ? meleeTypes : rangedTypes;
        const weapons: string[] = [];
        Object.keys(itemData).forEach((name) => {
            const baseItem = itemData[name];

            // Slot check
            if (baseItem.slot !== "Weapon") {
                return;
            }

            const weapon = baseItem as WeaponItem;

            // Ranged/melee type check
            if (!types.includes(weapon.type)) {
                return;
            }

            // Damage check
            if (weapon.damageType === "Special") {
                return;
            }

            if (canShowPart(weapon, spoilersState)) {
                weapons.push(name);
            }
        });

        if (melee) {
            weapons.push("Ram");
        }

        // Sort and create weapon option HTML elements
        weapons.sort(gallerySort);
        const weaponOptions = weapons.map((w) => `<option>${w}</option>`).join();

        // Create weapon elements
        const parent = $('<div class="input-group mt-1"></div>');
        const selectLabel = $(
            '<span class="input-group-text" data-toggle="tooltip" title="Name of an equipped weapon to fire">Weapon</span>',
        );
        const select = $(`<select class="selectpicker" data-live-search="true">${weaponOptions}</select>`);
        const helpButton = $('<button class="btn part-help-btn" data-html=true data-toggle="popover">?</button>');
        const massLabel = $(`
        <div class="input-group-prepend ml-2" data-toggle="tooltip" title="The mass of cogmind. Ram damage is a random amount from 0 to (((10 + [mass]) / 5) + 1) * ([speed%] / 100) * [momentum].">
            <span class="input-group-text">Mass</span>
        </div>`);
        const massInput = $('<input class="form-control" placeholder="0" />');
        const overloadContainer = $('<div class="btn-group btn-group-toggle ml-2" data-toggle="buttons"></div>');
        const overloadLabelContainer = $(
            '<div class="input-group-prepend" data-toggle="tooltip" title="Whether to fire the weapon as overloaded (double damage)."></div>',
        );
        const overloadLabel = $('<span class="input-group-text">Overload</span>');
        const overloadNoLabel = $(
            '<label class="btn active"><input type="radio" checked name="options">No</input></label>',
        );
        const overloadYesLabel = $('<label class="btn"><input type="radio" name="options">Yes</input></label>');
        const exoContainer = $('<div class="btn-group btn-group-toggle ml-2" data-toggle="buttons"></div>');
        const exoLabelContainer = $(
            '<div class="input-group-prepend" data-toggle="tooltip" title="Whether a Sigix Exoskeleton is equipped (double damage)."></div>',
        );
        const exoLabel = $('<span class="input-group-text">Exoskeleton</span>');
        const exoNoLabel = $('<label class="btn active"><input type="radio" checked name="options">No</input></label>');
        const exoYesLabel = $('<label class="btn"><input type="radio" name="options">Yes</input></label>');
        const numberLabel = $(`
        <div class="input-group-prepend ml-2" data-toggle="tooltip" title="How many weapons of this type to have equipped.">
            <span class="input-group-text">Number</span>
        </div>`);
        const numberInput = $('<input class="form-control" placeholder="1" />');
        const deleteButton = $('<button class="btn ml-2" data-toggle="tooltip" title="Removes the weapon.">X</button>');

        // Add elements to DOM
        container.append(parent[0]);
        parent.append(selectLabel[0]);
        parent.append(select[0]);
        parent.append(helpButton[0]);
        parent.append(overloadContainer[0]);
        overloadContainer.append(overloadLabelContainer[0]);
        overloadLabelContainer.append(overloadLabel[0]);
        overloadContainer.append(overloadNoLabel[0]);
        overloadContainer.append(overloadYesLabel[0]);
        parent.append(exoContainer[0]);
        exoContainer.append(exoLabelContainer[0]);
        exoLabelContainer.append(exoLabel[0]);
        exoContainer.append(exoNoLabel[0]);
        exoContainer.append(exoYesLabel[0]);
        parent.append(massLabel[0]);
        parent.append(massInput[0]);
        parent.append(numberLabel[0]);
        parent.append(numberInput[0]);
        parent.append(deleteButton[0]);

        resetButtonGroup(overloadContainer);
        resetButtonGroup(exoContainer);

        deleteButton.on("click", () => {
            // Ensure the last dropdown is always empty
            if (parent.next().length === 0) {
                addWeaponSelect("");
            }

            // Remove the associated item
            select.selectpicker("destroy");
            (deleteButton as any).tooltip("dispose");
            parent.remove();
        });

        select.selectpicker("val", weaponName);

        const updateContent = (weaponName: string) => {
            let weapon: WeaponItem | undefined;

            if (weaponName in itemData) {
                weapon = itemData[weaponName] as WeaponItem;
                helpButton.attr("data-content", createItemDataContent(weapon));
                (helpButton as any).popover();
            }

            if (weapon === undefined) {
                // If no valid weapon hide all options
                overloadContainer.addClass("not-visible");
                exoContainer.addClass("not-visible");
            } else if (weapon.overloadStability !== undefined) {
                // Show the overload option
                overloadContainer.removeClass("not-visible");
                resetButtonGroup(exoContainer);
                exoContainer.addClass("not-visible");
            } else if (sigixWeapons.includes(weapon.name) && getSpoilerState() === "Redacted") {
                // Show the exoskeleton option
                overloadContainer.addClass("not-visible");
                resetButtonGroup(overloadContainer);
                exoContainer.removeClass("not-visible");
            } else {
                // If can't overload and not sigix weapon then hide all
                resetButtonGroup(overloadContainer);
                overloadContainer.addClass("not-visible");
                resetButtonGroup(exoContainer);
                exoContainer.addClass("not-visible");
            }

            if (weaponName === "Ram") {
                // If ramming then show mass and hide weapon number
                massLabel.removeClass("not-visible");
                massInput.removeClass("not-visible");
                numberLabel.addClass("not-visible");
                numberInput.addClass("not-visible");
            } else {
                // Otherwise do the reverse
                massLabel.addClass("not-visible");
                massInput.addClass("not-visible");
                numberLabel.removeClass("not-visible");
                numberInput.removeClass("not-visible");
            }
        };

        // Set initial weapon info
        updateContent(weaponName);

        // Update content when the weapon selection changes
        select.on("changed.bs.select", () => {
            if (parent.next().length === 0) {
                addWeaponSelect("");
            }

            updateContent(select.selectpicker("val") as any as string);
        });

        select.parent().addClass("weapon-dropdown");

        // Enable tooltips
        (deleteButton as any).tooltip();
        (numberLabel as any).tooltip();
        (selectLabel as any).tooltip();
        (massLabel as any).tooltip();
        (overloadLabelContainer as any).tooltip();
        (exoLabelContainer as any).tooltip();

        // Minor hack, the btn-light class is auto-added to dropdowns with search
        // but it doesn't really fit with everything else
        parent.find(".btn-light").removeClass("btn-light");
    }

    // Gets a dataset's overall settings with some defaults
    function getDatasetSettings(label: string, backgroundColor: string, borderColor: string): ChartDataset<"scatter"> {
        return {
            type: "scatter",
            data: [],
            fill: "start",
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            label: label,
            pointRadius: 0,
            pointHitRadius: 25,
            showLine: true,
            stepped: "before",
        };
    }

    // Gets the number of simulations to perform
    function getNumSimulations() {
        const stringValue = ($("#numFightsInput").val() as string).replace(",", "");
        return parseIntOrDefault(stringValue, 100000);
    }

    // Initialize the page state
    async function init() {
        // Reinstate for beta 12
        // const isB11 = getB11State();
        await initData(items as any, bots as any);

        createHeader("Simulator", $("#headerContainer"));
        // $("#beta11Checkbox").prop("checked", getB11State());
        registerDisableAutocomplete($(document));

        // Set initial state
        resetButtonGroup($("#combatTypeContainer"));
        resetButtonGroup($("#xAxisContainer"));
        resetButtonGroup($("#showLootContainer"));
        resetButtonGroup($("#onLegsContainer"));
        $("#comparisonChartNameInput").val("");
        resetValues();
        updateChoices();

        // Register handlers
        $("#spoilerDropdown > button").on("click", (e) => {
            const state = $(e.target).text();
            $("#spoilers").text(state);
            setSpoilerState(state);
            ($("#spoilerDropdown > button") as any).tooltip("hide");
            updateChoices();
        });
        $("#reset").on("click", () => {
            ($("#reset") as any).tooltip("hide");
            resetValues();
        });
        $("#botSelect").on("changed.bs.select", () => {
            const botName = ($("#botSelect") as any).selectpicker("val") as string;
            let bot: Bot;
            if (botName === dumpMindTargetName) {
                const maybeBot = getBotOrNull(savedTargetEntity?.entity ?? "");
                if (maybeBot === null) {
                    // Don't process dumpmind data content unless we can match the name
                    $("#enemyInfoButton").addClass("not-visible");
                    return;
                }

                bot = maybeBot!;
            } else {
                bot = getBot(botName);
            }

            $("#enemyInfoButton").removeClass("not-visible");
            $("#enemyInfoButton").attr("data-content", createBotDataContent(bot, getSpoilerState()));

            if (bot.name === "A-15 Conveyor") {
                $("#endConditionNoTnc").removeClass("not-visible");
            } else {
                $("#endConditionNoTnc").addClass("not-visible");
            }

            refreshSelectpicker($("#endConditionSelect"));
        });
        $("#combatTypeContainer > label > input").on("change", () => {
            updateChoices();
        });
        $("#showLootContainer > label > input").on("change", () => {
            updateShowLoot();
        });
        $("#simulateButton").on("click", () => {
            simulate();
        });
        $("#cancelButton").on("click", () => {
            cancelled = true;
        });
        $("#addComparisonButton").on("click", () => {
            addComparison();
        });
        $("#comparisonChartNameInput").on("change", () => {
            let label = $("#comparisonChartNameInput").val() as string;
            if (label === "") {
                label = "Custom Comparison";
            }

            comparisonChart.options.plugins!.title!.text = label;
            comparisonChart.update();
        });

        // Reinstate for beta 12
        // $("#beta11Checkbox").on("change", () => {
        //     const isB11 = $("#beta11Checkbox").prop("checked");
        //     setB11State(isB11);
        //     const newItems = (isB11 ? itemsB11 : items) as any;
        //     const newBots = (isB11 ? botsB11 : bots) as any;

        //     initData(newItems, newBots);

        //     // Initialize page state
        //     resetValues();
        //     updateChoices();

        //     ($("#beta11Checkbox").parent() as any).tooltip("hide");
        // });

        $(window).on("click", (e) => {
            // If clicking outside of a popover close the current one
            const targetPopover = $(e.target).parents(".popover").length != 0;

            if (targetPopover) {
                $(e.target).trigger("blur");
            } else if (!targetPopover && $(".popover").length >= 1) {
                ($('[data-toggle="popover"]') as any).not(e.target).popover("hide");
            }
        });

        // Enable tooltips/popovers
        ($('[data-toggle="tooltip"]') as any).tooltip();

        //Set initial bot info
        const bot = getBot(($("#botSelect") as any).selectpicker("val"));
        $("#enemyInfoButton").attr("data-content", createBotDataContent(bot, getSpoilerState()));
        ($("#enemyInfoButton") as any).popover();

        enablePopoverBotInfoInteraction($("#enemyInfoButton"));

        // These divs are created at runtime so have to do this at init
        $("#damageReductionSelect").parent().addClass("percent-dropdown");
        $("#botSelectContainer > div").addClass("enemy-dropdown");
        $("#turnsSinceMovingSelectContainer > div").addClass("turns-since-moving-dropdown");
        $("#enemyBehaviorSelectContainer > div").addClass("enemy-behavior-dropdown");
        $("#siegeSelectContainer > div").addClass("siege-dropdown");
        $("#kinecelleratorSelect").parent().addClass("percent-dropdown");
        $("#overloadSelect").parent().addClass("percent-dropdown");
        $("#armorIntegSelect").parent().addClass("percent-dropdown");
        $("#sneakAttackSelect").parent().addClass("sneak-attack-dropdown");
        $("#endConditionSelect").parent().addClass("end-condition-dropdown");

        // Minor hack, the btn-light class is auto-added to dropdowns with search
        // but it doesn't really fit with everything else
        $(".btn-light").removeClass("btn-light");

        initCharts();
        initImportFromDumpMind();
    }

    // Initializes the charts with default settings and no data
    function initCharts() {
        const perXDataset = getDatasetSettings("Current volley kill %", "rgba(0, 98, 0, 0.3)", "rgba(0, 196, 0, 1)");
        const cumulativeDataset = getDatasetSettings(
            "Cumulative kill %",
            "rgba(96, 96, 96, 0.3)",
            "rgba(128, 128, 128, 1)",
        );

        let chartElement = $("#chart");
        chart = new Chart<"scatter">(chartElement as any, {
            type: "scatter",
            data: {
                datasets: [perXDataset, cumulativeDataset],
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 16,
                            },
                        },
                    },
                    title: {
                        display: true,
                        font: {
                            size: 24,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            stepSize: 1,
                        },
                        min: 0,
                        title: {
                            display: true,
                            font: {
                                size: 24,
                            },
                            text: "Number of volleys",
                        },
                    },
                    y: {
                        border: {
                            color: "rgba(128, 128, 128, 0.8)",
                            display: true,
                        },
                        grid: {
                            color: "rgba(128, 128, 128, 0.8)",
                        },
                        title: {
                            display: true,
                            font: {
                                size: 24,
                            },
                            text: "Percent of kills",
                        },
                        min: 0,
                        ticks: {
                            callback: (tickValue, _index, _ticks) => tickValue + "%",
                        },
                    },
                },
            },
        });

        chartElement = $("#comparisonChart");
        comparisonChart = new Chart<"scatter">(chartElement as any, {
            data: {
                datasets: [],
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 16,
                            },
                        },
                    },
                    title: {
                        display: true,
                        font: {
                            size: 24,
                        },
                        text: "Custom Comparison",
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        title: {
                            display: true,
                            font: {
                                size: 24,
                            },
                            text: "Number of time units",
                        },
                        min: 0,
                        ticks: {
                            stepSize: 100,
                        },
                    },
                    y: {
                        border: {
                            color: "rgba(128, 128, 128, 0.8)",
                            display: true,
                        },
                        grid: {
                            color: "rgba(128, 128, 128, 0.8)",
                        },
                        min: 0,
                        ticks: {
                            callback: (tickValue, _index, _ticks) => tickValue + "%",
                        },
                        title: {
                            display: true,
                            font: {
                                size: 24,
                            },
                            text: "Percent of kills",
                        },
                    },
                },
            },
        });
    }

    // Initializes the import from DumpMind button
    function initImportFromDumpMind() {
        // Init data content
        const importFromDumpMindButton = $("#importFromDumpMindButton");
        importFromDumpMindButton.attr(
            "data-content",
            `
<span class="input-label dump-input-label d-flex" data-toggle="tooltip"
title="Paste the data created by Luigi's DumpMind below">Paste from <a class="d-contents" href="https://github.com/aronson/WalkMind/tree/main">DumpMind</a> below: </span>
<textarea id="dumpText" rows="10" class="form-control dump-input-textarea mt-3"></textarea>
<div class="d-flex justify-content-end input-group mt-2">
    <button id="dumpSubmitButton" class="btn ml-3">Submit</button>
</div>
`,
        );
        // We can't add the data content for both a tooltip and a popover in HTML
        // Add the tooltip info here instead
        (importFromDumpMindButton as any).tooltip({
            title: "Import data from Luigi's DumpMind",
        });

        (importFromDumpMindButton as any).popover({
            sanitize: false,
        });
        importFromDumpMindButton.on("shown.bs.popover", (e) => {
            (importFromDumpMindButton as any).tooltip("hide");

            // Set up popover dump handling
            const body = $(`#${$(e.target).attr("aria-describedby")}`).children(".popover-body");

            // Hack to stop focus from being moved outside of the textarea immediately
            body.find("#dumpText").on("click", (e) => {
                e.stopPropagation();
            });

            (body.find('[data-toggle="tooltip"]') as any).tooltip();

            // Add handling for submit button
            const submitButton = body.find("#dumpSubmitButton");

            submitButton.on("click", () => {
                const text = body.find("#dumpText").val() as string;

                try {
                    const entities = JSON.parse(text) as DumpMindEntity[];

                    if (entities.length == 0) {
                        temporarilySetValue(submitButton, "Invalid JSON!", "Submit", 3000);
                    } else {
                        const cogmindEntity = entities.find((e) => e.entity === "Cogmind");
                        const targetEntity = entities.find((e) => e.entity !== "Cogmind");

                        if (cogmindEntity === undefined) {
                            temporarilySetValue(submitButton, "Invalid JSON!", "Submit", 3000);
                        } else {
                            loadStateFromDumpMind(cogmindEntity, targetEntity);
                            (importFromDumpMindButton as any).popover("hide");
                        }
                    }
                } catch (e) {
                    console.log(e);
                    temporarilySetValue(submitButton, "Failed to load JSON!", "Submit", 3000);
                }
            });
        });
        $(".popover").on("click", (e) => {
            e.stopPropagation();
        });
    }

    // Checks if the combat type is melee or ranged
    function isMelee() {
        return $("#combatTypeMelee").hasClass("active");
    }

    // Loads the simulator state of active parts based on DumpMind
    function loadStateFromDumpMind(cogmindEntity: DumpMindEntity, targetEntity: DumpMindEntity | undefined) {
        const equippedParts = cogmindEntity.inventory
            .filter((p) => p.equipped)
            .map((p) => getItemOrNull(p.item)!)
            // Discard any unrecognized items
            .filter((p) => p != null);

        const weapons = equippedParts.filter((p) => p.slot === "Weapon");
        const propulsion = equippedParts.filter((p) => p.slot === "Propulsion");
        const utilities = equippedParts.filter((p) => p.slot === "Utility");

        const meleeWeapons = weapons.filter((w) => meleeTypes.includes(w.type));
        const rangedWeapons = weapons.filter((w) => rangedTypes.includes(w.type));
        const weaponsToAdd: { item: Item; number: number }[] = [];
        let weaponDefinitionArray: Item[];
        const isMelee = meleeWeapons.length === weapons.length;
        if (isMelee) {
            // Only do melee selection if all weapons are melee
            $("#combatTypeMelee").children().trigger("click");
            weaponDefinitionArray = meleeWeapons;
        } else {
            // Change to ranged selection if any ranged weapons are equipped
            $("#combatTypeRanged").children().trigger("click");
            weaponDefinitionArray = rangedWeapons;
        }

        for (const weaponDef of weaponDefinitionArray) {
            const existingEntry = weaponsToAdd.find((e) => e.item === weaponDef);

            if (existingEntry === undefined) {
                weaponsToAdd.push({ item: weaponDef, number: 1 });
            } else {
                existingEntry.number += 1;
            }
        }

        resetValues(false);

        for (const entry of weaponsToAdd) {
            const select = $("#weaponSelectContainer").children().last().find("select");
            const numberInput = $("#weaponSelectContainer").children().last().find("input");
            select.selectpicker("val", entry.item.name);

            if (entry.number > 1) {
                numberInput.val(entry.number);
            }
        }

        if (isMelee) {
            // Update melee utilities
            // Determine number of each Melee Analysis Suites
            const meleeAnalysisSuites = utilities.filter((p) => p.name === "Melee Analysis Suite").length;
            const impMeleeAnalysisSuites = utilities.filter((p) => p.name === "Imp. Melee Analysis Suite").length;
            const advMeleeAnalysisSuites = utilities.filter((p) => p.name === "Adv. Melee Analysis Suite").length;
            const expMeleeAnalysisSuites = utilities.filter((p) => p.name === "Exp. Melee Analysis Suite").length;
            if (meleeAnalysisSuites > 0) {
                $("#meleeAnalysisInput").val(meleeAnalysisSuites);
            }
            if (impMeleeAnalysisSuites > 0) {
                $("#impMeleeAnalysisInput").val(impMeleeAnalysisSuites);
            }
            if (advMeleeAnalysisSuites > 0) {
                $("#advMeleeAnalysisInput").val(advMeleeAnalysisSuites);
            }
            if (expMeleeAnalysisSuites > 0) {
                $("#expMeleeAnalysisInput").val(expMeleeAnalysisSuites);
            }

            // Determine number of each Force Boosters
            const forceBoosters = utilities.filter((p) => p.name === "Force Booster").length;
            const impForceBoosters = utilities.filter((p) => p.name === "Imp. Force Booster").length;
            const advForceBoosters = utilities.filter((p) => p.name === "Adv. Force Booster").length;
            if (forceBoosters > 0) {
                $("#forceBoosterInput").val(forceBoosters);
            }
            if (impForceBoosters > 0) {
                $("#impForceBoosterInput").val(impForceBoosters);
            }
            if (advForceBoosters > 0) {
                $("#advForceBoosterInput").val(advForceBoosters);
            }

            // Calculate actuators
            const actuating = Math.max(
                50,
                utilities
                    .filter((p) => hasActiveSpecialProperty(p, true, "Actuator"))
                    .map((p) => (p.specialProperty!.trait as Actuator).amount)
                    .reduce(sum, 0),
            );

            if (actuating > 0) {
                $("#actuatorInput").val(actuating);
            }

            // Calculate actuator arrays
            const actuatorArrayBonuses = utilities
                .filter((p) => hasActiveSpecialProperty(p, true, "ActuatorArray"))
                .map((p) => (p.specialProperty!.trait as ActuatorArray).amount);
            actuatorArrayBonuses.sort();
            const actuatorArrayBonus1 = actuatorArrayBonuses.pop();
            const actuatorArrayBonus2 = actuatorArrayBonuses.pop();
            const actuatorArrayBonus =
                valueOrDefault(actuatorArrayBonus1, 0) + Math.trunc(valueOrDefault(actuatorArrayBonus2, 0) / 2);
            if (actuatorArrayBonus > 0) {
                $("#actuatorArrayInput").val(actuatorArrayBonus);
            }

            // Calculate bonus momentum
            if (utilities.find((p) => hasActiveSpecialProperty(p, true, "ReactionControlSystem")) !== undefined) {
                $("#bonusMomentumInput").val(1);
            }

            $("#speedInput").val(cogmindEntity.speed);
        } else {
            // Update ranged utilities
            // Calculate targeting bonuses from standard targeting computers + combat suites
            let targetingBonus =
                utilities
                    .filter((p) => hasActiveSpecialProperty(p, true, "Targeting"))
                    .map((p) => (p.specialProperty!.trait as Targeting).bonus)
                    .reduce(sum, 0) +
                utilities
                    .filter((p) => hasActiveSpecialProperty(p, true, "CombatSuite"))
                    .map((p) => (p.specialProperty!.trait as CombatSuite).targeting)
                    .reduce(sum, 0);

            if (weapons.every((p) => p.type === ItemType.Launcher)) {
                // Add launcher guidance only if all weapons are launchers
                targetingBonus += utilities
                    .filter((p) => hasActiveSpecialProperty(p, true, "LauncherGuidance"))
                    .map((p) => (p.specialProperty!.trait as LauncherGuidance).bonus)
                    .reduce(sum, 0);
            }

            if (targetingBonus > 0) {
                $("#targetingInput").val(targetingBonus);
            }

            // Calculate tread slots #
            const numTreads = propulsion
                .filter((p) => p.type === ItemType.Treads)
                .map((p) => p.size)
                .reduce(sum, 0);
            if (numTreads > 0) {
                $("#treadsInput").val(numTreads);
            }

            // Maybe calculate siege here? Default to off for now

            // Maybe calculate distance here? Default to unset (6+ no bonus) for now

            // Calculate particle charging
            const particleChargingBonuses = utilities
                .filter((p) => hasActiveSpecialProperty(p, true, "ParticleCharging"))
                .map((p) => (p.specialProperty!.trait as ParticleCharging).percent);
            particleChargingBonuses.sort();
            const chargingBonus1 = particleChargingBonuses.pop();
            const chargingBonus2 = particleChargingBonuses.pop();
            const chargingBonus = valueOrDefault(chargingBonus1, 0) + Math.trunc(valueOrDefault(chargingBonus2, 0) / 2);
            if (chargingBonus > 0) {
                $("#particleChargerInput").val(chargingBonus);
            }

            // Determine Kinecellerator type, only 3 types so just hardcode the checks
            if (utilities.find((p) => p.name === "Adv. Kinecellerator")) {
                $("#kinecelleratorSelect").selectpicker("val", "50%: Adv. Kinecellerator");
            } else if (utilities.find((p) => p.name === "Imp. Kinecellerator")) {
                $("#kinecelleratorSelect").selectpicker("val", "40%: Imp. Kinecellerator");
            } else if (utilities.find((p) => p.name === "Kinecellerator")) {
                $("#kinecelleratorSelect").selectpicker("val", "30%: Kinecellerator");
            }

            // Calculate salvage targeting
            const salvageTargetingBonus = utilities
                .filter((p) => hasActiveSpecialProperty(p, true, "SalvageTargeting"))
                .map((p) => (p.specialProperty!.trait as SalvageTargeting).amount)
                .reduce(sum, 0);
            if (salvageTargetingBonus > 0) {
                $("#salvageTargetingInput").val(salvageTargetingBonus);
            }

            // Calculate recoil reduction
            const recoilReduction = utilities
                .filter((p) => hasActiveSpecialProperty(p, true, "RecoilReduction"))
                .map((p) => (p.specialProperty!.trait as RecoilReduction).reduction)
                .reduce(sum, 0);
            if (recoilReduction > 0) {
                $("#recoilInput").val(recoilReduction);
            }

            // Determine best weapon cycler
            // Use special logic for qcap or launcher loader, otherwise default to normal stackable cyclers
            if (
                weapons.length === 1 &&
                (weapons[0].type === ItemType.EnergyCannon || weapons[0].type === ItemType.EnergyGun) &&
                utilities.find((p) => p.name === "Quantum Capacitor")
            ) {
                $("#cyclerInput").val(50);
            } else if (
                weapons.length === 1 &&
                weapons[0].type === ItemType.Launcher &&
                utilities.find((p) => p.name === "Launcher Loader")
            ) {
                $("#cyclerInput").val(50);
            } else {
                const cycling = Math.max(
                    30,
                    utilities
                        .filter(
                            (p) =>
                                hasActiveSpecialProperty(p, true, "RangedWeaponCycling") &&
                                p.name !== "Quantum Capacitor" &&
                                p.name !== "Launcher Loader",
                        )
                        .map((p) => (p.specialProperty!.trait as RangedWeaponCycling).amount)
                        .reduce(sum, 0),
                );

                if (cycling > 0) {
                    $("#cyclerInput").val(cycling);
                }
            }
        }

        // Determine common values
        // Determine Armor Integrity Analyzer
        if (utilities.find((p) => p.name === "Exp. Armor Integrity Analyzer")) {
            $("#armorIntegSelect").selectpicker("val", "50%: Exp. Armor Integrity Analyzer");
        } else if (utilities.find((p) => p.name === "Imp. Armor Integrity Analyzer")) {
            $("#armorIntegSelect").selectpicker("val", "40%: Imp. Armor Integrity Analyzer");
        } else if (utilities.find((p) => p.name === "Armor Integrity Analyzer")) {
            $("#armorIntegSelect").selectpicker("val", "30%: Armor Integrity Analyzer");
        }

        // Calculate core analyzer bonus
        let coreAnalyzerBonus = 0;
        if (utilities.find((p) => hasActiveSpecialProperty(p, true, "CombatSuite"))) {
            coreAnalyzerBonus = 8;
        } else {
            const coreAnalyzerBonuses = utilities
                .filter((p) => hasActiveSpecialProperty(p, true, "CoreAnalyzer"))
                .map((p) => (p.specialProperty!.trait as CoreAnalyzer).bonus);
            coreAnalyzerBonuses.sort();
            const coreAnalyzerBonus1 = coreAnalyzerBonuses.pop();
            const coreAnalyzerBonus2 = coreAnalyzerBonuses.pop();
            coreAnalyzerBonus =
                valueOrDefault(coreAnalyzerBonus1, 0) + Math.trunc(valueOrDefault(coreAnalyzerBonus2, 0) / 2);
        }

        if (coreAnalyzerBonus > 0) {
            $("#coreAnalyzerInput").val(coreAnalyzerBonus);
        }

        // Calculate target analyzer bonus
        const targetAnalyzerBonuses = utilities
            .filter((p) => hasActiveSpecialProperty(p, true, "TargetAnalyzer"))
            .map((p) => (p.specialProperty!.trait as TargetAnalyzer).bonus);
        targetAnalyzerBonuses.sort();
        const targetAnalyzerBonus1 = targetAnalyzerBonuses.pop();
        const targetAnalyzerBonus2 = targetAnalyzerBonuses.pop();
        const targetAnalyzerBonus =
            valueOrDefault(targetAnalyzerBonus1, 0) + Math.trunc(valueOrDefault(targetAnalyzerBonus2, 0) / 2);

        if (targetAnalyzerBonus > 0) {
            $("#targetAnalyzerInput").val(targetAnalyzerBonus);
        }

        // Save target entity if specified from DumpMind
        if (getBotOrNull(targetEntity?.entity ?? "") === null) {
            // Failed to find target bot, just bail now because we need
            // builtin bot data for many calculation purposes
            savedTargetEntity = undefined;
            return;
        }

        savedTargetEntity = targetEntity;

        updateBots();

        if (targetEntity !== undefined) {
            $("#botSelect").selectpicker("val", dumpMindTargetName);
        }
    }

    // Resets a dropdown to the first item
    function resetDropdown(dropdown) {
        dropdown.selectpicker("val", dropdown.children().val());
    }

    // Resets all values
    function resetValues(addDefault = true) {
        // Reset button groups
        resetButtonGroup($("#analysisContainer"));
        resetButtonGroup($("#onLegsContainer"));
        resetButtonGroup($("#siegeModeContainer"));

        // Reset dropdowns
        resetDropdown($("#damageReductionSelect"));
        resetDropdown($("#enemyBehaviorSelect"));
        resetDropdown($("#siegeSelect"));
        resetDropdown($("#kinecelleratorSelect"));
        resetDropdown($("#overloadSelect"));
        resetDropdown($("#armorIntegSelect"));
        resetDropdown($("#sneakAttackSelect"));
        resetDropdown($("#endConditionSelect"));

        // Reset text inputs
        $("#numFightsInput").val("");
        $("#actionsSinceMovingInput").val("");
        $("#tilesRunInput").val("");
        $("#targetingInput").val("");
        $("#treadsInput").val("");
        $("#distanceInput").val("");
        $("#particleChargerInput").val("");
        $("#salvageTargetingInput").val("");
        $("#recoilInput").val("");
        $("#cyclerInput").val("");
        $("#coreAnalyzerInput").val("");
        $("#targetAnalyzerInput").val("");
        $("#meleeAnalysisContainer > input").val("");
        $("#forceBoosterContainer > input").val("");
        $("#speedInput").val("");
        $("#actuatorInput").val("");
        $("#actuatorArrayInput").val("");
        $("#bonusMomentumInput").val("");
        $("#initialMomentumInput").val("");
        $("#comparisonNameInput").val("");

        // Reset with 1 preset weapon (if adding default) and one empty one
        $("#weaponSelectContainer").empty();

        if (addDefault) {
            const defaultWeapon = isMelee() ? "Mining Claw" : "Lgt. Assault Rifle";
            addWeaponSelect(defaultWeapon);
        }

        addWeaponSelect("");
        setStatusText("");

        // Temp test
        $("#resultsContainer").addClass("not-visible");
        $("#lootContainer").addClass("not-visible");
    }

    // Sets controls to disabled/enabled based on if the simulation is running
    function setSimulationRunning(running: boolean) {
        function setEnabled(selector: JQuery<HTMLElement>) {
            selector.removeClass("disabled");
            selector.prop("disabled", false);
        }
        function setDisabled(selector: JQuery<HTMLElement>) {
            selector.addClass("disabled");
            selector.prop("disabled", true);
        }
        const func = running ? setDisabled : setEnabled;

        func($("#spoilers"));

        func($("#combatTypeRanged"));
        func($("#combatTypeMelee"));
        func($("#numFightsInput"));
        func($("#reset"));

        func($("#botSelect").next());
        func($("#analysisNo"));
        func($("#analysisYes"));
        func($("#damageReductionSelect").next());

        func($("#actionsSinceMovingInput"));
        func($("#onLegsNo"));
        func($("#onLegsYes"));
        func($("#tilesRunInput"));
        func($("#enemyBehaviorSelect").next());

        func($("#targetingInput"));
        func($("#siegeSelect").next());
        func($("#treadsInput"));
        func($("#distanceInput"));
        func($("#particleChargerInput"));
        func($("#kinecelleratorSelect").next());
        func($("#salvageTargetingInput"));
        func($("#recoilInput"));
        func($("#cyclerInput"));

        func($("#overloadSelect").next());

        func($("#meleeAnalysisContainer > input"));
        func($("#forceBoosterContainer > input"));
        func($("#actuatorInput"));
        func($("#actuatorArrayInput"));
        func($("#bonusMomentumInput"));
        func($("#initialMomentumInput"));
        func($("#speedInput"));
        func($("#sneakAttackSelect").next());

        func($("#armorIntegSelect").next());
        func($("#coreAnalyzerInput"));
        func($("#targetAnalyzerInput"));

        func($("#weaponSelectContainer button").not(".weapon-help-btn"));
        func($("#weaponSelectContainer .btn").not(".weapon-help-btn"));
        func($("#weaponSelectContainer input"));

        func($("#xAxisVolleys"));
        func($("#xAxisTime"));
        func($("#showLootNo"));
        func($("#showLootYes"));
        func($("#endConditionSelect").next());

        // Update the cancel/simulate buttons
        if (running) {
            $("#cancelButton").removeClass("not-visible");
            $("#simulateButton").addClass("not-visible");
        } else {
            $("#cancelButton").addClass("not-visible");
            $("#simulateButton").removeClass("not-visible");
        }
    }

    // Sets the status label to the specified value
    function setStatusText(text: string) {
        $("#statusText").text(text);
    }

    // Simulates combat with the current settings and updates the chart (simulate button entry point)
    function simulate() {
        // Check inputs first
        const botName = $("#botSelect").selectpicker("val") as any as string;
        const userWeapons: { def: WeaponItem; overloaded: boolean }[] = [];
        $("#weaponSelectContainer select").each((_, s) => {
            const name = $(s).selectpicker("val") as any as string;
            if (name in itemData) {
                const weapon = itemData[name] as WeaponItem;

                // Tread invalid or unfilled numbers as 1
                const number = parseIntOrDefault($(s).parent().nextAll("input").not(".not-visible").val() as string, 1);

                const overloaded = !$(s).parent().nextAll(".btn-group").children("label").first().hasClass("active");
                // This is so terrible but I can't be bothered to figure out a better way
                const exo = !$($(s).parent().nextAll(".btn-group")[1]).children("label").first().hasClass("active");

                for (let i = 0; i < number; i++) {
                    // Overload and exoskeleton both double damage so just treat them the same
                    userWeapons.push({ def: weapon, overloaded: overloaded || exo });
                }
            } else if (name === "Ram") {
                const weapon: WeaponItem = {
                    categories: [],
                    category: ItemRatingCategory.None,
                    hackable: false,
                    index: 0,
                    integrity: 0,
                    name: "Ram",
                    fullName: "Ram",
                    noPrefixName: "Ram",
                    projectileCount: 1,
                    range: 2,
                    rating: 0,
                    ratingString: "",
                    size: 0,
                    slot: "N/A",
                    spoiler: "None",
                    type: ItemType.ImpactWeapon,
                    mass: parseIntOrDefault($(s).parent().nextAll("input").val() as string, 0),
                    noRepairs: false,
                };

                userWeapons.push({ def: weapon, overloaded: false });
            }
        });

        if (!(botName in botData) && botName !== dumpMindTargetName) {
            setStatusText(`Bot ${botName} is invalid, this is probably a bug.`);
            return;
        }

        if (userWeapons.length === 0) {
            setStatusText("There must be at least 1 weapon selected.");
            return;
        }

        // Set up initial calculation state
        const parts: SimulatorPart[] = [];
        let partCount = 0;
        function addPart(itemDef: Item, integrity: number) {
            const isProtection = itemDef.type === ItemType.Protection;
            const isTreads = itemDef.type === ItemType.Treads;
            const coverage = itemDef.coverage ?? 0;
            const siegedCoverage = isProtection || isTreads ? 2 * coverage : coverage;
            parts.push({
                armorAnalyzedCoverage: isProtection ? 0 : coverage,
                armorAnalyzedSiegedCoverage: isProtection ? 0 : siegedCoverage,
                coverage: coverage,
                def: itemDef,
                integrity: integrity,
                initialIndex: partCount++,
                protection: isProtection,
                selfDamageReduction: 1,
                siegedCoverage: siegedCoverage,
            });
        }

        let bot: Bot;
        let botCoreCoverage: number;
        let botIntegrity: number;
        let botTotalCoverage: number;
        if (botName === dumpMindTargetName) {
            const entity = savedTargetEntity!;
            bot = getBot(entity.entity);
            botTotalCoverage = 0;

            for (const part of entity.inventory.filter((p) => p.equipped)) {
                const itemDef = getItemOrNull(part.item);

                if (itemDef === null) {
                    // Failed to find a part, just ignore it
                    continue;
                }

                addPart(itemDef, part.integrity);
                botTotalCoverage += itemDef.coverage ?? 0;
            }

            botCoreCoverage = entity.exposure;
            botTotalCoverage += botCoreCoverage;
            botIntegrity = entity.integrity;
        } else {
            bot = getBot(botName);
            bot.componentData
                .concat(bot.armamentData)
                // For now just use the first option in each list
                .concat(bot.componentOptionData.map((c) => c[0]))
                .concat(bot.armamentOptionData.map((c) => c[0]))
                .forEach((item) => {
                    for (let i = 0; i < item.number; i++) {
                        const itemDef = getItem(item.name);
                        addPart(itemDef, itemDef.integrity);
                    }
                });

            botCoreCoverage = bot.coreCoverage;
            botTotalCoverage = bot.totalCoverage;
            botIntegrity = bot.coreIntegrity;
        }

        const armorAnalyzedCoverage =
            botCoreCoverage + parts.reduce((prev, part) => prev + part.armorAnalyzedCoverage, 0);
        const armorAnalyzedSiegedCoverage =
            botCoreCoverage + parts.reduce((prev, part) => prev + part.siegedCoverage, 0);
        const siegedCoverage = botCoreCoverage + parts.reduce((prev, part) => prev + part.siegedCoverage, 0);

        const behavior = $("#enemyBehaviorSelect").selectpicker("val") as any as BotBehavior;

        const externalDamageReduction =
            externalDamageReductionNameMap[$("#damageReductionSelect").selectpicker("val") as any as string];
        const defensiveState = getBotDefensiveState(parts, externalDamageReduction);

        let runningEvasion = 0;
        if (bot.speed < 100) {
            // Bots gain 1% of evasion for every 5 speed under 100
            runningEvasion = Math.trunc((100 - bot.speed) / 5);
        } else {
            runningEvasion = 0;
        }

        const sieged =
            behavior === "Already Sieged/Fight" &&
            parts.find((p) => p.def.type === ItemType.Treads && (p.def as PropulsionItem).siege !== undefined) !==
                undefined;

        // Enemy bot state
        const botState: BotState = {
            armorAnalyzedCoverage: armorAnalyzedCoverage,
            armorAnalyzedSiegedCoverage: armorAnalyzedSiegedCoverage,
            behavior: behavior,
            coreCoverage: botCoreCoverage,
            coreDisrupted: false,
            coreIntegrity: botIntegrity,
            corruption: 0,
            def: bot,
            defensiveState: defensiveState,
            externalDamageReduction: externalDamageReduction,
            immunities: bot.immunities,
            initialCoreIntegrity: botIntegrity,
            parts: parts,
            regen: getRegen(bot),
            resistances: bot.resistances === undefined ? {} : bot.resistances,
            running: behavior === "Running",
            runningEvasion: runningEvasion,
            runningMomentum: behavior === "Running" ? 3 : 0,
            salvage: 0,
            sieged: sieged,
            siegedCoverage: siegedCoverage,
            totalCoverage: botTotalCoverage,
            tusToSiege: behavior === "Siege/Fight" ? 500 : 0,
        };

        // Weapons and other offensive state
        let ramming = false;
        const melee = isMelee();
        const numTreads = parseIntOrDefault($("#treadsInput").val() as string, 0);

        // Accuracy bonuses and penalties
        const siegeBonus = melee ? null : siegeModeBonusMap[$("#siegeSelect").selectpicker("val") as any as string];
        let targetingComputerBonus = 0;
        if (!melee) {
            targetingComputerBonus = parseIntOrDefault($("#targetingInput").val() as string, 0);
        }

        // Melee analysis/force boosters
        const meleeAnalysis = [0, 0, 0, 0];
        const forceBoosters = [0, 0, 0];
        if (melee) {
            meleeAnalysisIds.map((id, i) => {
                meleeAnalysis[i] = parseIntOrDefault($(`#${id}`).val() as string, 0);
            });

            forceBoosterIds.map((id, i) => {
                forceBoosters[i] = parseIntOrDefault($(`#${id}`).val() as string, 0);
            });

            // Reduce force boosters to the 2 highest rating parts
            let numBoostersRemaining = 2;
            for (let i = forceBoosters.length - 1; i >= 0; i--) {
                if (forceBoosters[i] > numBoostersRemaining) {
                    forceBoosters[i] = numBoostersRemaining;
                    numBoostersRemaining = 0;
                } else {
                    numBoostersRemaining -= forceBoosters[i];
                }
            }
        }

        // Invalid / 6 or more tiles = 0 bonus
        let distance = parseIntOrDefault($("#distanceInput").val() as string, 6);
        if (distance <= 1) {
            // Less than or equal to 1, just assign to 1
            distance = 1;
        }

        // Recoil reduction
        const recoilReduction = parseIntOrDefault($("#recoilInput").val() as string, 0);

        const allRecoil = userWeapons.reduce(
            (prev, weapon) => getRecoil(weapon.def, numTreads, recoilReduction) + prev,
            0,
        );

        // Target Analyzer crit bonus
        const critBonus = parseIntOrDefault($("#targetAnalyzerInput").val() as string, 0);

        // Salvage targeting bonus
        const salvageTargetingBonus = parseIntOrDefault($("#salvageTargetingInput").val() as string, 0);

        const weapons = userWeapons.map((weapon, i) => {
            const def = weapon.def;
            let damageMin = 0;
            let damageMax = 0;
            let damageType: DamageType | undefined = undefined;
            let explosionMin = 0;
            let explosionMax = 0;
            let explosionType: DamageType | undefined = undefined;

            if (def.damage !== undefined) {
                // Found regular damage
                if (def.damage.includes("-")) {
                    const split = def.damage.split("-");
                    damageMin = parseInt(split[0]);
                    damageMax = parseInt(split[1]);
                } else {
                    damageMin = parseInt(def.damage);
                    damageMax = damageMin;
                }

                if (def.type === ItemType.BallisticGun || def.type === ItemType.BallisticCannon) {
                    // Increase minimum damage for kinecellerators (2)
                    const kinecelleratorName = $("#kinecelleratorSelect").selectpicker("val") as any as string;
                    const kinecelleratorBonus = kinecelleratorMap[kinecelleratorName];

                    damageMin = Math.trunc(damageMin * kinecelleratorBonus);

                    // Min damage can increase max
                    if (damageMin > damageMax) {
                        damageMax = damageMin;
                    }
                } else if (melee) {
                    // Apply damage for melee analyses/force boosters (2)
                    let minDamageIncrease = 0;
                    for (let i = 0; i < meleeAnalysisMinDamageIncrease.length; i++) {
                        minDamageIncrease += meleeAnalysis[i] * meleeAnalysisMinDamageIncrease[i];
                    }

                    // Ensure min damage can't exceed max
                    damageMin = Math.min(minDamageIncrease + damageMin, damageMax);

                    // Apply force boosters
                    // Earlier code ensures that there are at most 2 boosters enabled in the array
                    let maxDamageIncrease = 0;
                    let numBoostersProcessed = 0;
                    for (let i = forceBoosters.length - 1; i >= 0; i--) {
                        if (forceBoosters[i] == 2) {
                            maxDamageIncrease = 1.5 * forceBoosterMaxDamageIncrease[i];
                            numBoostersProcessed += 2;
                        } else if (forceBoosters[i] == 1) {
                            maxDamageIncrease +=
                                forceBoosterMaxDamageIncrease[i] * (numBoostersProcessed == 0 ? 1 : 0.5);
                            numBoostersProcessed += 1;
                        }
                    }

                    damageMax = Math.floor(damageMax * (1 + maxDamageIncrease));
                }

                damageType = def.damageType;
            }

            if (def.explosionDamage !== undefined) {
                // Found explosion damage
                if (def.explosionDamage.includes("-")) {
                    const split = def.explosionDamage.split("-");
                    explosionMin = parseInt(split[0]);
                    explosionMax = parseInt(split[1]);
                } else {
                    explosionMin = parseInt(def.explosionDamage);
                    explosionMax = explosionMin;
                }

                explosionType = def.explosionType;
            }

            // Get crit chance, only apply target analyzer if there's a specific bonus
            let critical: number;
            if (def.criticalType === Critical.Meltdown) {
                // Meltdown ignores target analyzer bonus
                critical = def.critical!;
            } else {
                critical = def.critical === undefined || def.critical === 0 ? 0 : def.critical + critBonus;
            }

            // Calculate base accuracy that can't change over the course of the fight
            let baseAccuracy = melee ? initialMeleeAccuracy : initialRangedAccuracy;

            if (!melee) {
                baseAccuracy += targetingComputerBonus;
            }

            // Size bonus/penalty
            if (bot.size in sizeAccuracyMap) {
                baseAccuracy += sizeAccuracyMap[bot.size];
            } else {
                console.log(`${botName} has invalid size ${bot.size}`);
            }

            // Builtin targeting
            if (def.targeting !== undefined) {
                baseAccuracy += def.targeting;
            }

            const delay = parseIntOrDefault(def.delay, 0);

            // Follow-up attacks on melee gain a 10% bonus to targeting
            const followUp = melee && i != 0;
            if (followUp) {
                baseAccuracy += 10;
            }

            const disruption = def.disruption ?? 0;
            const explosionDisruption = def.explosionDisruption ?? 0;

            const spectrum = spectrumToNumber(def.spectrum);
            const explosionSpectrum = spectrumToNumber(def.explosionSpectrum);

            const explosionChunksMin = def.minChunks ?? 1;
            const explosionChunksMax = def.maxChunks ?? 1;

            if (def.name === "Ram") {
                ramming = true;
            }

            // All launchers are missiles except for special cases
            const isMissile =
                def.type === "Launcher" &&
                def.name != "Sigix Terminator" &&
                def.name != "Supercharged Sigix Terminator" &&
                def.name != "Vortex Catalyst Activator";

            let salvage = def.salvage ?? 0;
            if (
                salvageTargetingBonus > 0 &&
                def.projectileCount == 1 &&
                (def.type === ItemType.BallisticGun || def.type === ItemType.EnergyGun)
            ) {
                salvage += salvageTargetingBonus;
            }

            const state: SimulatorWeapon = {
                accelerated: def.type === ItemType.EnergyGun || def.type === ItemType.EnergyCannon,
                accuracy: baseAccuracy,
                baseAccuracy: baseAccuracy,
                criticalChance: critical,
                criticalType: def.criticalType,
                damageMin: damageMin,
                damageMax: damageMax,
                damageType: damageType,
                def: def,
                delay: delay,
                disruption: disruption,
                explosionChunksMin: explosionChunksMin,
                explosionChunksMax: explosionChunksMax,
                explosionDisruption: explosionDisruption,
                explosionMin: explosionMin,
                explosionMax: explosionMax,
                explosionSpectrum: explosionSpectrum,
                explosionType: explosionType,
                isMissile: isMissile,
                numProjectiles: def.projectileCount,
                overflow: !def.type.includes("Gun"),
                overloaded: weapon.overloaded,
                salvage: salvage,
                spectrum: spectrum,
            };

            return state;
        });

        // Charger bonus
        const chargerValue = Math.max(parseIntOrDefault($("#particleChargerInput").val() as string, 0), 0);
        const chargerBonus = 1 + chargerValue / 100;

        // Armor Integrity Analyzer chance
        const armorAnalyzerName = $("#armorIntegSelect").selectpicker("val") as any as string;
        const armorAnalyzerChance = armorIntegrityMap[armorAnalyzerName];

        // Core Analyzer chance
        const coreAnalyzerChance = parseIntOrDefault($("#coreAnalyzerInput").val() as string, 0);

        // Actuator Array chance
        const actuatorArrayBonus = parseIntOrDefault($("#actuatorArrayInput").val() as string, 0);

        // Calculate followup chance
        const followupChances: number[] = [];
        if (melee) {
            // melee followup% = 20 + ([(primary weapon speed mod) - (followup weapon speed mod)] / 10)
            const baseChance = 20 + actuatorArrayBonus;
            weapons.forEach((weapon, i) => {
                if (i != 0) {
                    let chance = baseChance + Math.trunc((weapons[0].delay - weapon.delay) / 10);

                    // Clamp between 0-100
                    chance = Math.min(chance, 100);
                    chance = Math.max(chance, 0);

                    followupChances.push(chance);
                }
            });
        }

        // Get speed
        const speed = parseIntOrDefault($("#speedInput").val() as string, 100);

        // Get momentum
        const bonusMomentum = parseIntOrDefault($("#bonusMomentumInput").val() as string, 0);
        const initialMomentum = parseIntOrDefault($("#initialMomentumInput").val() as string, 0);

        // Determine sneak attack strategy
        const sneakAttackStrategy = $("#sneakAttackSelect").selectpicker("val") as any as SneakAttackStrategy;

        // Calculate total (ranged) or initial (melee) volley time
        const actuatorPercent = Math.max(0, Math.min(99, parseIntOrDefault($("#actuatorInput").val() as string, 0)));
        const cyclerPercent = Math.max(0, Math.min(99, parseIntOrDefault($("#cyclerInput").val() as string, 0)));
        const volleyTimeModifier = 1 - (melee ? actuatorPercent : cyclerPercent) / 100;

        const volleyTime = melee
            ? weapons[0].delay + volleyTimeMap[1]
            : getRangedVolleyTime(
                  weapons.map((w) => w.def),
                  volleyTimeModifier,
              );

        // Determine temporary accuracy modifiers
        // -10% if attacker moved last action (ignored in melee combat)
        // +10% if attacker didn't move for the last 2 actions
        // simulatorCalcs.ts will always enforce the +10% accuracy as part of the 3rd action
        let action1Accuracy: number;
        let action2Accuracy: number;
        const actionsSinceMoving = parseIntOrDefault($("#actionsSinceMovingInput").val() as string, 2);
        if (actionsSinceMoving == 0) {
            action1Accuracy = melee ? 0 : -10;
            action2Accuracy = 0;
        } else if (actionsSinceMoving == 1) {
            action1Accuracy = 0;
            action2Accuracy = 10;
        } else {
            action1Accuracy = 10;
            action2Accuracy = 10;
        }

        // -5~15% if attacker running on legs (ranged attacks only)
        const onLegs = $("#onLegsYes").hasClass("active");
        const tilesRun = onLegs ? parseIntOrDefault($("#tilesRunInput").val() as string, 0) : 0;
        if (tilesRun > 0 && !melee) {
            // Cap at 3 tiles moved
            action1Accuracy -= Math.min(tilesRun, 3) * 5;
        }

        const itemLootStates: ItemLootState[] = [];
        for (const part of botState.parts) {
            itemLootStates.push({
                item: part.def,
                numDrops: 0,
                totalCritRemoves: 0,
                totalCorruptionPercent: 0,
                totalFried: 0,
                totalIntegrity: 0,
            });
        }

        // Loot state
        const lootState: LootState = {
            numKills: 0,
            items: itemLootStates,
            matterBlasted: 0,
            matterDrop: 0,
        };

        // Other misc offensive state
        const offensiveState: OffensiveState = {
            action1Accuracy: action1Accuracy,
            action2Accuracy: action2Accuracy,
            armorAnalyzerChance: armorAnalyzerChance,
            analysis: $("#analysisYes").hasClass("active"),
            chargerBonus: chargerBonus,
            coreAnalyzerChance: coreAnalyzerChance,
            distance: distance,
            followupChances: followupChances,
            forceBoosters: forceBoosters,
            melee: melee,
            meleeAnalysis: meleeAnalysis,
            momentum: {
                bonus: bonusMomentum,
                current: bonusMomentum + initialMomentum,
                initial: initialMomentum,
            },
            numTreads: numTreads,
            ramming: ramming,
            recoil: allRecoil,
            recoilReduction: recoilReduction,
            siegeBonus: siegeBonus,
            sneakAttack: false,
            sneakAttackStrategy: sneakAttackStrategy,
            speed: speed,
            targetingComputerBonus: targetingComputerBonus,
            volleyTime: volleyTime,
            volleyTimeModifier: volleyTimeModifier,
        };

        const endCondition = $("#endConditionSelect").selectpicker("val") as any as string as EndCondition;

        // Overall state
        const state: SimulatorState = {
            actionNum: 0,
            botState: botState,
            endCondition: endCondition,
            initialBotState: botState,
            killTus: {},
            killVolleys: {},
            lootState: lootState,
            offensiveState: offensiveState,
            tus: 0,
            weapons: weapons,
        };

        // Disable all input fields while the simulation is running
        setSimulationRunning(true);

        // Run simulation
        cancelled = false;
        let i = 0;
        const numSimulations = getNumSimulations();
        const initial = performance.now();
        let lastFrame = initial;
        let lastStatusUpdate = lastFrame;

        // Run simulation in batches via setTimeout to avoid UI lockup.
        // After each 100 simulations check if we've surpassed 30 ms since the
        // last update (aim for ~30 fps)
        // If so then pass control back so events/updates can be processed.
        function run() {
            for (; i < numSimulations; i++) {
                if (i % 100 === 0) {
                    if (cancelled) {
                        // User cancelled
                        setStatusText("Cancelled simulation");
                        cancelled = false;
                        setSimulationRunning(false);
                        return;
                    }

                    const now = performance.now();
                    if (now - lastFrame > 30) {
                        lastFrame = now;

                        if (now - lastStatusUpdate > 100) {
                            // Only update status ~ 10 times a second
                            const percent = ((i * 100) / numSimulations).toFixed(1);
                            setStatusText(`${String(percent).padStart(4, "0")} % completed.`);
                            lastStatusUpdate = now;
                        }
                        setTimeout(run, 0);
                        break;
                    }
                }

                try {
                    if (!simulateCombat(state)) {
                        // Combat can only fail if we exceed max volleys
                        setStatusText(`The simulation exceeded ${maxVolleys} volleys and will likely never kill.`);
                        setSimulationRunning(false);
                        return;
                    }
                } catch (e) {
                    console.log(e);
                    setStatusText("The simulation encountered an unexpected error, this is a bug.");
                    setSimulationRunning(false);
                    return;
                }
            }

            if (i >= numSimulations) {
                setSimulationRunning(false);
                let time = performance.now() - initial;
                time /= 1000;
                setStatusText(`Completed in ${time.toFixed(2)} seconds.`);
                updateChart(state);

                const button = $("#addComparisonButton");
                button.removeClass("disabled");
                button.prop("disabled", false);
            }
        }

        run();
    }

    // Updates the chart based on the current simulation state
    function updateChart(state: SimulatorState) {
        function getClassHighGood(value: number) {
            if (value <= 0.25) {
                return "details-range-red";
            } else if (value <= 0.5) {
                return "details-range-orange";
            } else if (value <= 0.75) {
                return "details-range-yellow";
            } else {
                return "details-range-green";
            }
        }
        function getClassHighBad(value: number) {
            if (value <= 0.25) {
                return "details-range-green";
            } else if (value <= 0.5) {
                return "details-range-yellow";
            } else if (value <= 0.75) {
                return "details-range-orange";
            } else {
                return "details-range-red";
            }
        }

        const numSimulations = getNumSimulations();

        // Update loot boxes
        // Do this even if currently hidden so it can be flipped on without re-running sim
        const lootContainer = $("#lootContainer");
        lootContainer.empty();
        updateShowLoot();

        // Show corruption/crits for all parts if any has relevant stats for consistency
        const showCorruption =
            state.lootState.items.find((item) => item.totalCorruptionPercent > 0 || item.totalFried > 0) !== undefined;
        const showCrits = state.lootState.items.find((item) => item.totalCritRemoves > 0) !== undefined;

        // Add matter first
        const matterDropAmount = state.lootState.matterDrop / state.lootState.numKills;
        const matterBlastedAmount = state.lootState.matterBlasted / state.lootState.numKills;

        // Create HTML
        const boxContainer = $(`<div class = "loot-box mx-1 my-1"></div>`);
        const itemName = $(
            `<span class="loot-box-part-name mx-1">Matter <span class="no-wrap">[<img src="${getItemSpriteImageName(
                getItem("Matter"),
            )}"/>]</span></span>`,
        );
        const contentGrid = $(`<grid class = "loot-box-content-grid"></grid>`);
        const matterDropAmountLabel = $(`<span>Avg. Death Drop</span>`);
        const matterDropAmountValue = $(
            `<span class = "${getClassHighGood(
                matterDropAmount / state.botState.def.salvageHigh,
            )}">${matterDropAmount.toFixed(1)}/${state.botState.def.salvagePotential}</span>`,
        );
        const matterBlastedAmountLabel = $(`<span>Avg. Blasted Off</span>`);
        const matterBlastedAmountValue = $(`<span>${matterBlastedAmount.toFixed(1)}</span>`);

        // Add to DOM
        lootContainer.append(boxContainer[0]);
        boxContainer.append(itemName[0]);
        boxContainer.append(contentGrid[0]);
        contentGrid.append(matterDropAmountLabel[0]);
        contentGrid.append(matterDropAmountValue[0]);

        if (matterBlastedAmount > 0) {
            contentGrid.append(matterBlastedAmountLabel[0]);
            contentGrid.append(matterBlastedAmountValue[0]);
        }

        // Update items
        for (const item of state.lootState.items) {
            // Calculate numbers/percentages
            const dropRatePercent = (item.numDrops / state.lootState.numKills) * 100;
            const averageDropIntegrity = item.totalIntegrity > 0 ? item.totalIntegrity / item.numDrops : 0;
            const averageCorruptionGain = item.totalCorruptionPercent / item.numDrops;
            const friedPercent = (item.totalFried / state.lootState.numKills) * 100;
            const critRatePercent = item.totalCritRemoves > 0 ? (item.totalCritRemoves / item.numDrops) * 100 : 0;

            // Create HTML
            const boxContainer = $(`<div class = "loot-box mx-1 my-1"></div>`);
            const itemName = $(
                `<span class="loot-box-part-name mx-1">${
                    item.item.name
                } <span class="no-wrap">[<img src="${getItemSpriteImageName(item.item)}"/>]</span></span>`,
            );
            const contentGrid = $(`<grid class = "loot-box-content-grid"></grid>`);
            const dropRateLabel = $(`<span>Drop Rate</span>`);
            const dropRateValue = $(
                `<span class = "${getClassHighGood(dropRatePercent / 70)}">${dropRatePercent.toFixed(1)}%</span>`,
            );
            const dropIntegrityLabel = $(`<span>Avg. Integrity</span>`);
            const dropIntegrityValue = $(
                `<span class = "${getClassHighGood(
                    averageDropIntegrity / item.item.integrity,
                )}">${averageDropIntegrity.toFixed(1)}/${item.item.integrity}</span>`,
            );
            const corruptionGainLabel = $(`<span>Avg. Corruption</span>`);
            const corruptionGainValue = $(
                `<span class = "${getClassHighBad(averageCorruptionGain / 7.5)}">${averageCorruptionGain.toFixed(
                    1,
                )}%</span>`,
            );
            const friedRateLabel = $(`<span>Fried Rate</span>`);
            const friedRateValue = $(
                `<span class = "${getClassHighBad(friedPercent / 40)}">${friedPercent.toFixed(1)}%</span>`,
            );
            const critRateLabel = $(`<span>Crit Off Rate</span>`);
            const critRateValue = $(`<span>${critRatePercent.toFixed(1)}%</span>`);

            // Add to DOM
            lootContainer.append(boxContainer[0]);
            boxContainer.append(itemName[0]);
            boxContainer.append(contentGrid[0]);
            contentGrid.append(dropRateLabel[0]);
            contentGrid.append(dropRateValue[0]);
            contentGrid.append(dropIntegrityLabel[0]);
            contentGrid.append(dropIntegrityValue[0]);

            if (showCorruption) {
                contentGrid.append(corruptionGainLabel[0]);
                contentGrid.append(corruptionGainValue[0]);
                contentGrid.append(friedRateLabel[0]);
                contentGrid.append(friedRateValue[0]);
            }

            if (showCrits) {
                contentGrid.append(critRateLabel[0]);
                contentGrid.append(critRateValue[0]);
            }
        }

        // Calculate data, round to the given number of decimal places and
        // ignore values smaller to reduce clutter
        function getData(
            perXKillsKeys: string[],
            perXKillsObject: { [key: number]: number },
            numDecimalPlaces: number,
            stepSize: number,
        ) {
            const data = perXKillsKeys
                .filter((numX) => perXKillsObject[numX] / numSimulations > Math.pow(10, -2 - numDecimalPlaces))
                .map((numX) => {
                    return {
                        x: parseInt(numX),
                        y:
                            Math.trunc((perXKillsObject[numX] / numSimulations) * Math.pow(10, 2 + numDecimalPlaces)) /
                            Math.pow(10, numDecimalPlaces),
                    };
                });

            if (data.length < 5) {
                // Add a 0 kill ending point if there aren't many data points
                // to fill out a bit more nicely
                data.push({
                    x: data[data.length - 1].x + stepSize,
                    y: 0,
                });
            }

            return data;
        }

        function getCumulativeData(data: Point[]) {
            const cumulativeData: Point[] = [];
            let total = 0;
            data.forEach((point) => {
                total += point.y;
                cumulativeData.push({
                    x: point.x,
                    y: Math.trunc(total * 100) / 100,
                });
            });

            return cumulativeData;
        }

        // Get datasets
        const perXDataset = chart.data.datasets![0];
        const cumulativeDataset = chart.data.datasets![1];
        const perVolleys = $("#xAxisVolleys").hasClass("active");

        let perXData: Point[];
        const perXString = $("#endConditionSelect").selectpicker("val") as any as string;
        let stepSize: number;
        let xString: string;
        let xAxisString: string;

        // Get comparison data first
        const perXKillsKeys = Object.keys(state.killTus);
        perXKillsKeys.sort((a, b) => parseFloat(a) - parseFloat(b));
        // Note: Melee (especially with followups) can create a lot of
        // relatively  lower probability scenarios due to strange melee delays
        // so add an extra decimal place to avoid cutting out too many
        // results that the max total % would end up being unreasonably
        // low (like under 80%) when killing enemies with particularly
        // large health pools.
        const tuData = getData(perXKillsKeys, state.killTus, state.offensiveState.melee ? 3 : 1, 100);
        currentComparisonData = getCumulativeData(tuData);

        if (perVolleys) {
            // Show data per volley
            xString = "Volleys";
            stepSize = 1;
            xAxisString = "Number of volleys";

            perXData = getData(Object.keys(state.killVolleys), state.killVolleys, 1, 1);
        } else {
            // Show data per time unit
            xString = "Time Units";
            stepSize = state.offensiveState.volleyTime;
            xAxisString = "Number of time units";

            perXData = getData(perXKillsKeys, state.killTus, state.offensiveState.melee ? 3 : 1, stepSize);
        }

        const cumulativeData = getCumulativeData(perXData);

        // Update chart
        (chart.options.scales!.x! as LinearScaleOptions).ticks.stepSize = stepSize;
        chart.options.scales!.x!.title!.text = xAxisString;
        perXDataset.data = perXData;
        cumulativeDataset.data = cumulativeData;

        chart.options.plugins!.title!.text = `${xString}/${perXString} vs. ${$("#botSelect").selectpicker("val")}`;
        chart.update();
        $("#resultsContainer").removeClass("not-visible");
    }

    // Updates the available choices for the bot dropdowns
    function updateBots() {
        const spoilersState = getSpoilerState();

        // Update all bot selections after saving old pick
        const select = $("#botSelect");
        const oldBot = select.selectpicker("val") as any as string;
        select.empty();

        const sortedBots = Object.keys(botData);
        sortedBots.sort();
        sortedBots.forEach((name) => {
            const bot = botData[name];

            if (canShowSpoiler(bot.spoiler, spoilersState)) {
                select.append(`<option>${name}</option>`);
            }
        });

        if (savedTargetEntity !== undefined) {
            // Add DumpMind Target option if there is an imported target
            select.append(`<option>${dumpMindTargetName}</option>`);
        }

        refreshSelectpicker(select);

        // Try to preserve the old bot, otherwise default
        select.selectpicker("val", oldBot);

        if (select.selectpicker("val") === null) {
            select.selectpicker("val", "G-34 Mercenary");
        }
    }

    // Updates the available choices for the dropdowns depending on spoiler state and combat type
    function updateChoices() {
        const spoilersState = getSpoilerState();
        updateBots();

        // Don't show arch tele condition when not on redacted
        if (spoilersState === "Redacted") {
            $("#endConditionArchTele").removeClass("not-visible");
        } else {
            $("#endConditionArchTele").addClass("not-visible");
        }
        refreshSelectpicker($("#endConditionSelect"));
        const melee = isMelee();

        function setVisibility(selector: JQuery<HTMLElement>, visible: boolean) {
            visible ? selector.removeClass("not-visible") : selector.addClass("not-visible");
        }

        setVisibility($("#rangedAccuracyContainer"), !melee);
        setVisibility($("#rangedUtilitiesContainer"), !melee);
        setVisibility($("#rangedUtilitiesContainer2"), !melee);
        setVisibility($("#meleeAnalysisContainer"), melee);
        setVisibility($("#forceBoosterContainer"), melee);
        setVisibility($("#meleeBehaviorContainer"), melee);
        setVisibility($("#meleeUtilitiesContainer"), melee);

        // Reset with 1 preset weapon and one empty one
        const defaultWeapon = melee ? "Mining Claw" : "Lgt. Assault Rifle";
        $("#weaponSelectContainer").empty();
        addWeaponSelect(defaultWeapon);
        addWeaponSelect("");
    }

    // Updates visibility of the loot boxes
    function updateShowLoot() {
        const showLoot = $("#showLootYes").hasClass("active");
        if (showLoot) {
            $("#lootContainer").removeClass("not-visible");
        } else {
            $("#lootContainer").addClass("not-visible");
        }
    }
});
