import React from "react";
import "./careers.css";
import JobCard from "./JobCard.jsx";
import jobs from "./jobs.json";

export default function Careers() {
  const [locationFilter, setLocationFilter] = React.useState("All");
  const [teamFilter, setTeamFilter] = React.useState("All");

  const filteredJobs = jobs.filter(job => {
    const locationMatch = locationFilter === "All" || job.location === locationFilter;
    const teamMatch = teamFilter === "All" || job.team === teamFilter;
    return locationMatch && teamMatch;
  });

  const locations = ["All", ...new Set(jobs.map(j => j.location))];
  const teams = ["All", ...new Set(jobs.map(j => j.team))];

  return (
    <div className="gqx-careers">
      <section className="gqx-careers-hero">
        <h1>Build the future of multi‑asset execution</h1>
        <p>
          Join GlobalQuantX and help design the control plane for institutional and advanced retail traders.
        </p>
      </section>

      <section className="gqx-careers-filters">
        <div>
          <label>Location</label>
          <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            {locations.map(loc => <option key={loc}>{loc}</option>)}
          </select>
        </div>
        <div>
          <label>Team</label>
          <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)}>
            {teams.map(team => <option key={team}>{team}</option>)}
          </select>
        </div>
      </section>

      <section className="gqx-careers-jobs">
        <h2>Open Roles</h2>
        <div className="gqx-careers-job-grid">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
          {filteredJobs.length === 0 && <p>No roles match your filters right now.</p>}
        </div>
      </section>

      <section className="gqx-careers-culture">
        <h2>Culture</h2>
        <p>
          We operate like a trading desk: high trust, high accountability, and a bias for shipping resilient systems.
        </p>
      </section>

      <section className="gqx-careers-benefits">
        <h2>Benefits</h2>
        <div className="gqx-benefits-grid">
          <div>
            <h4>Remote‑Friendly</h4>
            <p>Work from key financial hubs or remotely with strong collaboration rituals.</p>
          </div>
          <div>
            <h4>Ownership</h4>
            <p>Meaningful equity and the ability to shape the platform from the ground up.</p>
          </div>
          <div>
            <h4>Learning</h4>
            <p>Budget for conferences, certifications, and deep technical or market research.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

