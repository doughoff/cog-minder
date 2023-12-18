import {
    FloatingArrow,
    FloatingFocusManager,
    FloatingPortal,
    Placement,
    arrow,
    autoUpdate,
    flip,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useId,
    useInteractions,
    useMergeRefs,
    useRole,
} from "@floating-ui/react";
import * as React from "react";
import { useRef } from "react";

import "./Popover.less";

interface PopoverOptions {
    initialOpen?: boolean;
    placement?: Placement;
    modal?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

// From https://floating-ui.com/docs/popover
export function usePopover({
    initialOpen = false,
    placement = "bottom",
    modal,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: PopoverOptions = {}) {
    const arrowRef = useRef(null);
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
    const [labelId, setLabelId] = React.useState<string | undefined>();
    const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;

    const data = useFloating({
        placement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(5),
            flip({
                crossAxis: placement.includes("-"),
                fallbackAxisSideDirection: "end",
                padding: 5,
            }),
            shift({ padding: 5 }),
            arrow({ element: arrowRef }),
        ],
    });

    const context = data.context;

    const click = useClick(context, {
        enabled: controlledOpen == null,
    });
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const interactions = useInteractions([click, dismiss, role]);

    return React.useMemo(
        () => ({
            open,
            setOpen,
            arrowRef,
            ...interactions,
            ...data,
            modal,
            labelId,
            descriptionId,
            setLabelId,
            setDescriptionId,
        }),
        [open, setOpen, arrowRef, interactions, data, modal, labelId, descriptionId],
    );
}

type ContextType =
    | (ReturnType<typeof usePopover> & {
          setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
          setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
      })
    | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
    const context = React.useContext(PopoverContext);

    if (context == null) {
        throw new Error("Popover components must be wrapped in <Popover />");
    }

    return context;
};

export function Popover({
    children,
    modal = false,
    ...restOptions
}: {
    children: React.ReactNode;
} & PopoverOptions) {
    // This can accept any props as options, e.g. `placement`,
    // or other positioning options.
    const popover = usePopover({ modal, ...restOptions });
    return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

type PopoverTriggerProps = {
    children: React.ReactNode;
    asChild?: boolean;
};

export const PopoverTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & PopoverTriggerProps>(
    function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
        const context = usePopoverContext();
        const childrenRef = (children as any).ref;
        const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

        // `asChild` allows the user to pass any element as the anchor
        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(
                children,
                context.getReferenceProps({
                    ref,
                    ...props,
                    ...children.props,
                    "data-state": context.open ? "open" : "closed",
                }),
            );
        }

        return (
            <button
                ref={ref}
                type="button"
                // The user can style the trigger based on the state
                data-state={context.open ? "open" : "closed"}
                {...context.getReferenceProps(props)}
            >
                {children}
            </button>
        );
    },
);

export const PopoverContent = React.forwardRef<
    HTMLElement,
    React.HTMLProps<HTMLElement> & { style?: React.CSSProperties | undefined }
>(function PopoverContent({ style, ...props }, propRef) {
    const { context: floatingContext, ...context } = usePopoverContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    if (!floatingContext.open) {
        return null;
    }

    return (
        <FloatingPortal>
            <FloatingFocusManager context={floatingContext} modal={context.modal}>
                <div
                    ref={ref as any}
                    style={{ ...context.floatingStyles, ...style }}
                    aria-labelledby={context.labelId}
                    aria-describedby={context.descriptionId}
                    {...context.getFloatingProps(props)}
                >
                    {props.children}
                    <FloatingArrow
                        className="tooltip-arrow"
                        tipRadius={2}
                        height={8}
                        ref={context.arrowRef}
                        context={floatingContext}
                    />
                </div>
            </FloatingFocusManager>
        </FloatingPortal>
    );
});

export const PopoverHeading = React.forwardRef<HTMLHeadingElement, React.HTMLProps<HTMLHeadingElement>>(
    function PopoverHeading(props, ref) {
        const { setLabelId } = usePopoverContext();
        const id = useId();

        // Only sets `aria-labelledby` on the Popover root element
        // if this component is mounted inside it.
        React.useLayoutEffect(() => {
            setLabelId(id);
            return () => setLabelId(undefined);
        }, [id, setLabelId]);

        return (
            <h2 {...props} ref={ref} id={id}>
                {props.children}
            </h2>
        );
    },
);

export const PopoverDescription = React.forwardRef<HTMLParagraphElement, React.HTMLProps<HTMLParagraphElement>>(
    function PopoverDescription(props, ref) {
        const { setDescriptionId } = usePopoverContext();
        const id = useId();

        // Only sets `aria-describedby` on the Popover root element
        // if this component is mounted inside it.
        React.useLayoutEffect(() => {
            setDescriptionId(id);
            return () => setDescriptionId(undefined);
        }, [id, setDescriptionId]);

        return <p {...props} ref={ref} id={id} />;
    },
);

export const PopoverClose = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined }
>(function PopoverClose(props, ref) {
    const { setOpen } = usePopoverContext();
    return (
        <button
            type="button"
            ref={ref}
            {...props}
            onClick={(event) => {
                props.onClick?.(event);
                setOpen(false);
            }}
        />
    );
});
