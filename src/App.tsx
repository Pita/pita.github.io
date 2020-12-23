import React from "react";
import { useState } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useWebWorker } from "./useWebWorker";

import "./index.scss";

const codeString = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.generatedRegexMatcher = generatedRegexMatcher;
`;

const App = () => {
  const [regex, setRegex] = useState(
    "^([a-z0-9._%-]+@[a-z0-9.-]+\\.[a-z]{2,6})*$"
  );
  const [flags, setFlags] = useState("i");
  const [code, setCode] = useState(codeString);
  const { generate } = useWebWorker();
  const onSubmitClick = () => {
    // // TODO: nice state management
    const regexStr = `/${regex}/${flags}`;
    generate({ regexStr, type: "js" }).then((code) => {
      setCode(code);
    }); // TODO: error handling
  };

  return (
    <>
      <Jumbotron
        style={{
          background:
            "linear-gradient(to right top, #071b26, #0a384f, #0a577b, #0e78ac, #1b9adf)",
        }}
      >
        <Container>
          <h1 style={{ color: "white" }}>Reco</h1>
          <p style={{ color: "white" }}>
            Regular Expression COmpiler - Compile a regex ahead of time to code
          </p>
        </Container>
      </Jumbotron>
      <Container>
        <InputGroup className="mb-3 text-monospace">
          <InputGroup.Prepend>
            <InputGroup.Text>/</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="yourRegex"
            aria-label="Regex"
            aria-describedby="basic-addon2"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
          />
          <InputGroup.Append>
            <InputGroup.Text>/</InputGroup.Text>
          </InputGroup.Append>
          <InputGroup.Append>
            <FormControl
              placeholder="flags"
              aria-label="Flags"
              aria-describedby="basic-addon2"
              value={flags}
              htmlSize={2}
              onChange={(e) => setFlags(e.target.value)}
            />
          </InputGroup.Append>
        </InputGroup>
        <Form inline className="justify-content-end">
          <Form.Control as="select" className="mb-3 ml-sm-3">
            <option>Javascript</option>
            <option>Typescript</option>
          </Form.Control>
          <Button
            variant="primary"
            className="mb-3 ml-sm-3"
            onClick={onSubmitClick}
          >
            Generate
          </Button>
        </Form>
        <Card className="mt-4">
          <Card.Header>Generated Code</Card.Header>
          <SyntaxHighlighter language="javascript" style={vs} className="p-3">
            {code}
          </SyntaxHighlighter>
        </Card>
      </Container>
    </>
  );
};

export default App;
