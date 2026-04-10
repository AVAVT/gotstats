"use client";

import ScrollSpy from "react-scrollspy-navigation";

const links = [
  ["total_games_stats", "Win/Loss ratio"],
  ["game_results", "Game results distribution"],
  ["board_sizes_stats", "Performance across board sizes"],
  ["time_settings_stats", "Performance across time settings"],
  ["opponents_stats", "Opponents statistics"],
  ["misc_stats", "Miscellaneous information"],
] as const;

export type QuickLinksProps = {
  scrollToElem: (link: string) => void;
};

export default function QuickLinks({ scrollToElem }: QuickLinksProps) {
  const onLinkClicked = (link: string) => {
    scrollToElem(link);
  };

  const renderLink = (linkData: (typeof links)[number], index: number) => (
    <li key={index}>
      <a
        href={`#${linkData[0]}`}
        onClick={(e) => {
          e.preventDefault();
          onLinkClicked(linkData[0]);
        }}
      >
        {linkData[1]}
      </a>
    </li>
  );

  return (
    <ScrollSpy activeClass="active">
      <nav className="">{links.map(renderLink)}</nav>
    </ScrollSpy>
  );
}
