const CRITERIA = [
  { key: "industry", label: "Industry match", weight: 35 },
  { key: "companySize", label: "Company-size match", weight: 25 },
  { key: "supportNeed", label: "Support-automation need", weight: 30 },
  { key: "contact", label: "Relevant contact identified", weight: 10 },
];

export function qualifyLead(lead, icp) {
  let confirmedScore = 0;
  let evidenceCoverage = 0;

  const breakdown = CRITERIA.map((criterion) => {
    const { key, weight, label } = criterion;

    let matches = null;
    let evidence = "Missing information";

    if (key === "industry") {
      if (lead.industry && icp.industry) {
        matches =
          lead.industry.trim().toLowerCase() ===
          icp.industry.trim().toLowerCase();

        evidence = matches
          ? "Industry matches the target"
          : "Industry differs from the target";
      }
    }

    if (key === "companySize") {
      if (
        Number.isFinite(lead.employeeCount) &&
        Number.isFinite(icp.minEmployees) &&
        Number.isFinite(icp.maxEmployees)
      ) {
        matches =
          lead.employeeCount >= icp.minEmployees &&
          lead.employeeCount <= icp.maxEmployees;

        evidence = matches
          ? "Employee count is within the target range"
          : "Employee count is outside the target range";
      }
    }

    if (key === "supportNeed") {
      if (typeof lead.supportAutomationNeed === "boolean") {
        matches = lead.supportAutomationNeed;
        evidence = matches
          ? "Support-automation need is reported"
          : "Support-automation need is not reported";
      }
    }

    if (key === "contact") {
      if (typeof lead.hasRelevantContact === "boolean") {
        matches = lead.hasRelevantContact;
        evidence = matches
          ? "A relevant contact is identified"
          : "A relevant contact has not been identified";
      }
    }

    if (matches !== null) {
      evidenceCoverage += weight;

      if (matches) {
        confirmedScore += weight;
      }
    }

    return {
      criterion: label,
      weight,
      status:
        matches === null
          ? "unknown"
          : matches
            ? "match"
            : "mismatch",
      evidence,
      points: matches === true ? weight : 0,
    };
  });

  return {
    confirmedScore,
    evidenceCoverage,
    qualificationStatus:
      evidenceCoverage === 0
        ? "insufficient_data"
        : confirmedScore >= 70
          ? "high_fit"
          : confirmedScore >= 40
            ? "medium_fit"
            : "low_fit",
    breakdown,
    missingEvidence: breakdown
      .filter((item) => item.status === "unknown")
      .map((item) => item.criterion),
    scoringNote:
      "Confirmed fit points are out of 100. Evidence coverage shows how much of the scoring criteria was assessed. This is not a conversion probability.",
  };
}