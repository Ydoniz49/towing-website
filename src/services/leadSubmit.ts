type SubmitLeadResponse = {
	ok: boolean;
	id?: string;
	error?: string;
	retryAfter?: number;
};

export async function submitLead(payload: unknown): Promise<SubmitLeadResponse> {
	const res = await fetch('/api/submit-lead', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const json = (await res.json().catch(() => ({}))) as SubmitLeadResponse;
	if (!res.ok || !json.ok) {
		throw new Error(json.error || `Submission failed (${res.status})`);
	}

	return json;
}
