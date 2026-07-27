import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Footer } from "./Footer";

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe("Footer Component", () => {
  it("renders the brand logo and tagline", () => {
    renderFooter();
    // Brand name
    const travelElements = screen.getAllByText(/Travel/i);
    expect(travelElements.length).toBeGreaterThanOrEqual(1);
    // The brand has "Log" in TravelLog — exact match to avoid copyright
    expect(screen.getByText("Log")).toBeInTheDocument();
    // Tagline
    expect(screen.getByText(/discover breathtaking destinations/i)).toBeInTheDocument();
  });

  it("renders the Company section with all links", () => {
    renderFooter();
    const companySection = screen.getByText("company").closest("div");
    expect(companySection).toBeInTheDocument();

    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Explore Tours")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders the Tours section with all links", () => {
    renderFooter();
    expect(screen.getByText("Popular Tours")).toBeInTheDocument();
    expect(screen.getByText("All Destinations")).toBeInTheDocument();
    expect(screen.getByText("Mood Boards")).toBeInTheDocument();
    expect(screen.getByText("Compare Destinations")).toBeInTheDocument();
  });

  it("renders the Support section with all links", () => {
    renderFooter();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText("Traveler Stories")).toBeInTheDocument();
    expect(screen.getByText("Why TravelLog")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("renders hash links (/#about, /#tours, /#contact) as anchor tags with correct hrefs", () => {
    renderFooter();
    const aboutLink = screen.getByText("About Us").closest("a");
    expect(aboutLink).toHaveAttribute("href", "/#about");

    const popularToursLink = screen.getByText("Popular Tours").closest("a");
    expect(popularToursLink).toHaveAttribute("href", "/#tours");

    const contactLink = screen.getAllByText("Contact Us")[0].closest("a");
    expect(contactLink).toHaveAttribute("href", "/#contact");
  });

  it("renders internal page links (Link components) with correct hrefs", () => {
    renderFooter();
    // All Destinations
    const allDestinations = screen.getByText("All Destinations").closest("a");
    expect(allDestinations).toHaveAttribute("href", "/tours");

    // Dashboard
    const dashboard = screen.getByText("Dashboard").closest("a");
    expect(dashboard).toHaveAttribute("href", "/dashboard");

    // Compare Destinations
    const compare = screen.getByText("Compare Destinations").closest("a");
    expect(compare).toHaveAttribute("href", "/compare");
  });

  it("renders all social media links", () => {
    renderFooter();
    expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("YouTube")).toBeInTheDocument();

    const instagram = screen.getByLabelText("Instagram");
    expect(instagram).toHaveAttribute("href", "#");
  });

  it("renders contact information", () => {
    renderFooter();
    expect(screen.getByText("hello@travellog.com")).toBeInTheDocument();
    expect(screen.getByText("+91 1800-TRAVEL")).toBeInTheDocument();
    expect(screen.getByText("Mumbai, Maharashtra, India")).toBeInTheDocument();
  });

  it("renders the copyright notice with the current year", () => {
    renderFooter();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
    expect(screen.getByText(/TravelLog\. All rights reserved\./)).toBeInTheDocument();
  });

  it("renders the correct number of link columns", () => {
    renderFooter();
    // Company, Tours, Support = 3 columns
    expect(screen.getByText("company")).toBeInTheDocument();
    expect(screen.getByText("tours")).toBeInTheDocument();
    expect(screen.getByText("support")).toBeInTheDocument();
  });

  it("has 12 total navigation links in the footer columns", () => {
    renderFooter();
    // Company: 4, Tours: 4, Support: 4 = 12 total
    const linkItems = screen.getAllByRole("listitem");
    expect(linkItems).toHaveLength(12);
  });

  it("has 3 social links", () => {
    renderFooter();
    const socialLinks = [
      screen.getByLabelText("Instagram"),
      screen.getByLabelText("Twitter"),
      screen.getByLabelText("YouTube"),
    ];
    expect(socialLinks).toHaveLength(3);
  });

  it("hash link prevents default and scrolls on landing page", async () => {
    // Set pathname to "/" to simulate being on landing page
    Object.defineProperty(window, "location", {
      value: { pathname: "/", hash: "" },
      writable: true,
    });

    // Mock scrollIntoView
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    // Mock getElementById to return a mock element
    const mockElement = document.createElement("div");
    const getElementByIdMock = vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

    renderFooter();

    // Click "About Us" hash link
    const aboutLink = screen.getByText("About Us");
    aboutLink.click();

    // Should have called getElementById with "about"
    expect(getElementByIdMock).toHaveBeenCalledWith("about");

    // Should have scrolled
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    getElementByIdMock.mockRestore();
  });

  it("Brand logo links to home page", () => {
    renderFooter();
    // The TravelLog brand text is split across elements with "Travel" and "Log"
    // Use getAllByRole and find the one with href="/"
    const allLinks = screen.getAllByRole("link");
    const brandLink = allLinks.find((link) => link.getAttribute("href") === "/");
    expect(brandLink).toBeDefined();
    expect(brandLink).toHaveTextContent(/travel/i);
  });
});
