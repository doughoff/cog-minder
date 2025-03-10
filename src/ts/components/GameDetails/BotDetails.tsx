import { ReactNode } from "react";
import { Link } from "wouter";

import { Bot, BotLocation, BotPart } from "../../types/botTypes";
import { Item } from "../../types/itemTypes";
import { valueOrDefault } from "../../utilities/common";
import useItemData from "../Effects/useItemData";
import { useSpoilers } from "../Effects/useLocalStorageValue";
import { ItemLink, ItemTooltip } from "../Pages/WikiPage/WikiTooltips";
import { BotItemPopoverButton } from "../Popover/ItemPopover";
import {
    DetailsBotTitleLine,
    DetailsEmptyLine,
    DetailsRangeLine,
    DetailsSummaryLine,
    DetailsTextLine,
    DetailsTextLineDim,
} from "./Details";

import "./Details.less";

function getRatingValue(bot: Bot) {
    const ratingString = bot.rating;
    const ratingArray = ratingString
        .split("-")
        .map((s) => s.trim())
        .map((s) => parseInt(s));
    return ratingArray.reduce((sum, val) => sum + val, 0) / ratingArray.length;
}

function getSchematicDepthString(bot: Bot) {
    function capRange(depth: number) {
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

function NoneItemLine() {
    return <pre className="details-line"> None{" ".repeat(39)}</pre>;
}

function ItemLine({
    itemString,
    item,
    popoversToLinks = false,
}: {
    itemString: string;
    item: Item;
    popoversToLinks?: boolean;
}) {
    let itemNode: ReactNode = itemString.padEnd(42);

    if (popoversToLinks) {
        itemNode = <Link href={`/${item.name}`}>{itemNode}</Link>;
    }

    const line = (
        <pre className="details-part">
            <span className="bot-popover-item-bracket">[</span>
            {itemNode}
            <span className="bot-popover-item-bracket">]</span>
        </pre>
    );

    return popoversToLinks ? <ItemTooltip item={item}>{line}</ItemTooltip> : <BotItemPopoverButton triggerContent={line} item={item} />;
}

function BotPartLine({ data, popoversToLinks = false }: { data: BotPart; popoversToLinks?: boolean }) {
    const itemData = useItemData();
    let line = `${data.name} (${data.coverage}%)`;

    if (data.number > 1) {
        line += " x" + data.number;
    }

    return <ItemLine item={itemData.getItem(data.name)} itemString={line} popoversToLinks={popoversToLinks} />;
}

function ItemLineOption({ itemName, itemString, i }: { itemName: string; itemString: string; i: number }) {
    const itemData = useItemData();
    itemString = itemString.padEnd(39);

    const line = (
        <pre className="details-part">
            <span className="bot-popover-item-bracket">[</span>
            <span className="details-option">{String.fromCharCode(97 + i)}) </span>
            {itemString}
            <span className="bot-popover-item-bracket">]</span>
        </pre>
    );

    return <BotItemPopoverButton triggerContent={line} item={itemData.getItem(itemName)} />;
}

function BotPartOption({ data, itemsToLinks }: { data: BotPart[]; itemsToLinks: boolean }) {
    return (
        <>
            {data.map((botPart, i) => {
                let line: string;
                if (botPart.name === "None") {
                    line = "None";
                } else {
                    line = `${botPart.name} (${botPart.coverage}%)`;
                }

                if (botPart.number > 1) {
                    line += " x" + botPart.number;
                }

                return <ItemLineOption key={botPart.name} itemName={botPart.name} itemString={line} i={i} />;
            })}
        </>
    );
}

function ItemDetails({
    items,
    itemOptions,
    itemsToLinks,
}: {
    items: BotPart[];
    itemOptions: BotPart[][];
    itemsToLinks: boolean;
}) {
    function Option({ addEmptyLine, data, i }: { addEmptyLine: boolean; data: BotPart[]; i: number }) {
        return (
            <>
                {addEmptyLine && <DetailsEmptyLine />}
                <BotPartOption data={data} itemsToLinks={itemsToLinks} />
            </>
        );
    }

    return (
        <>
            {items.map((data) => {
                return <BotPartLine key={data.name} data={data} popoversToLinks={itemsToLinks} />;
            })}
            {itemOptions.map((data, i) => {
                return <Option key={i} addEmptyLine={items.length > 0 || i > 0} data={data} i={i} />;
            })}
        </>
    );
}

function ArmamentDetails({ bot, itemsToLinks }: { bot: Bot; itemsToLinks: boolean }) {
    if (bot.armament.length === 0) {
        return <NoneItemLine />;
    }

    return <ItemDetails items={bot.armamentData} itemOptions={bot.armamentOptionData} itemsToLinks={itemsToLinks} />;
}

function ComponentDetails({ bot, itemsToLinks }: { bot: Bot; itemsToLinks: boolean }) {
    if (bot.components.length === 0) {
        return <NoneItemLine />;
    }

    return <ItemDetails items={bot.componentData} itemOptions={bot.componentOptionData} itemsToLinks={itemsToLinks} />;
}

function DescriptionDetails({ bot }: { bot: Bot }) {
    if (bot.description.length === 0) {
        return undefined;
    }

    return (
        <>
            <DetailsEmptyLine />
            <DetailsSummaryLine text="Description" />
            <span className="details-description">&nbsp;{bot.description}</span>
        </>
    );
}

function FabricationDetails({ bot }: { bot: Bot }) {
    if (bot.fabrication === undefined) {
        return undefined;
    }

    const number = bot.fabrication.number;

    return (
        <>
            <DetailsEmptyLine />
            <DetailsSummaryLine text={number === "1" ? "Fabrication" : `Fabrication x${number}`} />
            <DetailsTextLine category="Time" content={bot.fabrication.time} />
            <DetailsTextLine category="Components" content="None" />
        </>
    );
}

function LocationDetails({ bot }: { bot: Bot }) {
    const spoilers = useSpoilers();
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

    if (locations.length === 0) {
        return undefined;
    }

    function Location({ location }: { location: BotLocation }) {
        if (location.Description !== undefined) {
            return (
                <>
                    <span className="details-location">&nbsp;{location.Location}</span>
                    <span className="details-description">&nbsp;&nbsp;{location.Description}</span>
                </>
            );
        } else {
            return <span className="details-location">&nbsp;{location.Location}</span>;
        }
    }

    return (
        <>
            <DetailsEmptyLine />
            <DetailsSummaryLine text="Locations" />
            {locations.map((location, i) => (
                <Location key={i} location={location} />
            ))}
        </>
    );
}

function ResistanceImmunityDetails({ bot }: { bot: Bot }) {
    const resistances = Object.keys(valueOrDefault(bot.resistances, {} as any));
    const immunities = bot.immunities;

    if (resistances.length === 0 && immunities.length === 0) {
        return undefined;
    }

    return (
        <>
            <DetailsEmptyLine />
            <DetailsSummaryLine text="Resistances" />
            {resistances.map((damageType) => {
                const resistValue = bot.resistances![damageType];

                if (resistValue === undefined) {
                    return;
                }

                if (resistValue > 0) {
                    return (
                        <DetailsRangeLine
                            key={damageType}
                            category={damageType}
                            colorScheme="Green"
                            maxValue={100}
                            minValue={0}
                            value={resistValue}
                            valueString={resistValue}
                            unitString="%"
                        />
                    );
                } else {
                    return (
                        <DetailsRangeLine
                            key={damageType}
                            category={damageType}
                            colorScheme="Red"
                            maxValue={-100}
                            minValue={0}
                            value={resistValue}
                            valueString={resistValue}
                            unitString="%"
                        />
                    );
                }
            })}
            {immunities.map((immunity) => (
                <DetailsTextLineDim key={immunity} category={immunity} text="IMMUNE" />
            ))}
        </>
    );
}

function TraitDetails({ bot }: { bot: Bot }) {
    if (bot.traits.length === 0) {
        return undefined;
    }

    return (
        <>
            <DetailsEmptyLine />
            <DetailsSummaryLine text="Traits" />
            {bot.traits.map((trait) => (
                <span key={trait} className="details-description">
                    &nbsp;{trait}
                </span>
            ))}
        </>
    );
}

export default function BotDetails({ bot, itemsToLinks }: { bot: Bot; itemsToLinks?: boolean }) {
    return (
        <div className="bot-details">
            <DetailsBotTitleLine bot={bot} />
            <DetailsEmptyLine />
            <DetailsSummaryLine text="Overview" />
            <DetailsTextLine category="Class" content={bot.class} />
            <DetailsTextLine category="Size" content={bot.size} />
            <DetailsTextLine category="Profile" content={bot.profile} />
            <DetailsRangeLine
                category="Rating"
                colorScheme="LowGood"
                minValue={0}
                maxValue={165}
                value={getRatingValue(bot)}
                valueString={bot.rating}
            />
            <DetailsTextLine category="Tier" content={bot.tier} />
            <DetailsTextLine category="Threat" content={bot.threat} />
            <DetailsTextLine category="Value" content={bot.value} />
            <DetailsTextLine category="Energy Generation" content={bot.energyGeneration} />
            <DetailsTextLine category="Heat Dissipation" content={bot.heatDissipation} />
            <DetailsTextLine category="Visual Range" content={bot.visualRange} />
            <DetailsTextLine category="Memory" content={bot.memory} />
            <DetailsTextLine category="Spot %" content={bot.spotPercent} />
            <DetailsTextLine category="Movement" content={bot.movement} />
            {bot.movementOverloaded && <DetailsTextLine category=" Overloaded" content={bot.movementOverloaded} />}
            <DetailsRangeLine
                category="Core Integrity"
                colorScheme="Green"
                minValue={0}
                maxValue={bot.coreIntegrity}
                value={bot.coreIntegrity}
                valueString={bot.coreIntegrity.toString()}
            />
            <DetailsRangeLine
                category="Core Exposure"
                colorScheme="LowGood"
                minValue={0}
                maxValue={100}
                value={bot.coreExposure}
                valueString={bot.coreExposure.toString()}
                unitString="%"
            />
            <DetailsTextLine category="Salvage Potential" content={bot.salvagePotential} />
            <DetailsTextLine
                category="Schematic"
                content={bot.fabrication ? "Hackable" : undefined}
                defaultContent="N/A"
            />
            {bot.fabrication && (
                <DetailsTextLine category=" Min Terminal/Depth" content={getSchematicDepthString(bot)} />
            )}
            <DetailsEmptyLine />
            <DetailsSummaryLine text="Armament" />
            <ArmamentDetails bot={bot} itemsToLinks={itemsToLinks || false} />
            <DetailsEmptyLine />
            <DetailsSummaryLine text="Components" />
            <ComponentDetails bot={bot} itemsToLinks={itemsToLinks || false} />
            <ResistanceImmunityDetails bot={bot} />
            <TraitDetails bot={bot} />
            <FabricationDetails bot={bot} />
            <DescriptionDetails bot={bot} />
            <LocationDetails bot={bot} />
        </div>
    );
}
