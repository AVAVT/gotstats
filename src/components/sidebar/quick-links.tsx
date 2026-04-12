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
    <a
      key={index}
      className="block"
      href={`#${linkData[0]}`}
      onClick={(e) => {
        e.preventDefault();
        onLinkClicked(linkData[0]);
      }}
    >
      {linkData[1]}
    </a>
  );

  return (
    <ScrollSpy activeClass="active">
      <nav id="navi_list" className="navi_list">
        {links.map(renderLink)}
      </nav>
    </ScrollSpy>
  );
}
