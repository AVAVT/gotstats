export default function Footer() {
  return (
    <footer className="footer flex-0">
      <div className="container flex flex-col md:flex-row justify-between">
        <div>
          <p>
            <em>
              "Got Stats?" analytics tool for{" "}
              <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.online-go.com">
                OGS
              </a>{" "}
              by AVAVT (aka Chinitsu).
            </em>
          </p>
          <p>
            <em>
              The source code is also available on{" "}
              <a href="https://github.com/AVAVT/gotstats" target="_blank" rel="noopener noreferrer nofollow">
                Github
              </a>
              .
            </em>
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <a href="http://avavt.github.io" target="_blank" rel="noopener noreferrer">
            About the author
          </a>
        </div>
      </div>
    </footer>
  );
}
