import React from "react";

export default function JobCard({ job }) {
  return (
    <div className="gqx-job-card">
      <h3>{job.title}</h3>
      <p className="gqx-job-meta">
        {job.location} · {job.team}
      </p>
      <p className="gqx-job-summary">{job.summary}</p>
      <a href={job.applyUrl} className="gqx-job-apply">Apply now</a>
    </div>
  );
}

