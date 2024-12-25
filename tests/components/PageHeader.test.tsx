import React from "react";
import { it, expect, describe, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PageHeader from "../../src/components/PageHeader"; // Adjust the path as necessary

describe("PageHeader component", () => {
  beforeEach(() => {
    render(
      <PageHeader
        title="Page Title"
        subTitle="Page Subtitle"
        icon={<div>Icon</div>}
      />
    );
  });

  it("should render title and subtitle", () => {
    expect(screen.getByText("Page Title")).toBeInTheDocument();
    expect(screen.getByText("Page Subtitle")).toBeInTheDocument();
  });

  it("should render icon", () => {
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });
});
