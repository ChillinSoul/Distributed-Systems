import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

let App;

// eslint-disable-next-line react/display-name, @typescript-eslint/no-unused-vars
export default App = () => <SwaggerUI url="/docs/openapi.yaml" />;
