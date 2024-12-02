import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
// eslint-disable-next-line react/display-name
export default function DocsPage() {
  return (
    <div style={{ margin: "20px" }}>
      <SwaggerUI url="./api/docs" />
    </div>
  );
}
