"use client";

import {
  CSSProperties,
  cloneElement,
  ReactElement,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "vat-ui";

export interface StylingOnVisibleProps {
  children: ReactElement<{ className?: string; style?: CSSProperties }>;
  className?: string;
  style?: CSSProperties;
  inViewClassName?: string;
  inViewStyle?: CSSProperties;
  heightInViewRatio?: number;
}

export default function StylingChangeOnVisible({
  children,
  className = "",
  style = {},
  inViewClassName = "",
  inViewStyle = {},
  heightInViewRatio = 0.7,
}: StylingOnVisibleProps) {
  const [observedElement, setObservedElement] = useState<Element | null>(null);
  const [isInView, setIsInView] = useState(false);
  const originalRef = (children as ReactElement & { ref?: Ref<Element> }).ref;

  const threshold = useMemo(() => {
    if (heightInViewRatio < 0) return 0;
    if (heightInViewRatio > 1) return 1;
    return heightInViewRatio;
  }, [heightInViewRatio]);

  useEffect(() => {
    if (isInView) return;

    const element = observedElement;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: [threshold] },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isInView, observedElement, threshold]);

  const setChildRef = useCallback(
    (node: Element | null) => {
      setObservedElement(node);

      if (!originalRef) return;

      if (typeof originalRef === "function") {
        originalRef(node);
        return;
      }

      (originalRef as RefObject<Element | null>).current = node;
    },
    [originalRef],
  );

  const mergedClassName = isInView
    ? cn(children.props.className, className, inViewClassName)
    : cn(children.props.className, className);

  const mergedStyle = isInView
    ? { ...children.props.style, ...style, ...inViewStyle }
    : { ...children.props.style, ...style };

  return cloneElement(
    children as ReactElement<Record<string, unknown>>,
    {
      ref: setChildRef,
      className: mergedClassName,
      style: mergedStyle,
    } as Record<string, unknown>,
  );
}
