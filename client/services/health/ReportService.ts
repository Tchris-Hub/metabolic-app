import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { HealthAggregationService } from '../HealthAggregationService';
import { supabase } from '../supabase/config';

export class ReportService {
  static async generateHealthReportPDF(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const health = await HealthAggregationService.getCurrentUserHealth(user.id);

    const today = new Date().toLocaleDateString();
    const lastUpdated = health.lastUpdated ? new Date(health.lastUpdated).toLocaleString() : 'N/A';

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen; padding: 24px; color: #111827; }
            .header { display:flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
            .badge { background: #FF9800; color:#fff; padding: 6px 10px; border-radius: 999px; font-weight: 700; font-size: 12px; }
            h1 { margin: 0; font-size: 22px; }
            h2 { font-size: 16px; margin: 0 0 8px; }
            .card { border:1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
            .row { display:flex; gap: 12px; }
            .col { flex:1; }
            .meta { color:#6b7280; font-size: 12px; }
            .kv { display:flex; justify-content: space-between; font-weight: 600; padding: 8px 0; border-bottom: 1px dashed #e5e7eb; }
            .kv:last-child { border-bottom: none; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Medical Summary Report</h1>
              <div class="meta">Generated ${today}</div>
            </div>
            <div class="badge">Metabolic Health</div>
          </div>
          <div class="card">
            <h2>Latest Readings</h2>
            <div class="row">
              <div class="col">
                <div class="kv"><span>Blood Sugar (mg/dL)</span><span>${health.lastBloodSugar ?? '—'}</span></div>
                <div class="kv"><span>Blood Pressure (mmHg)</span><span>${health.lastBloodPressure ? `${health.lastBloodPressure.systolic}/${health.lastBloodPressure.diastolic}` : '—'}</span></div>
                <div class="kv"><span>Weight (kg)</span><span>${health.lastWeight ?? '—'}</span></div>
              </div>
              <div class="col">
                <div class="kv"><span>Blood Sugar Trend</span><span>${health.recentTrends.bloodSugar}</span></div>
                <div class="kv"><span>Weight Trend</span><span>${health.recentTrends.weight}</span></div>
                <div class="kv"><span>Last Updated</span><span>${lastUpdated}</span></div>
              </div>
            </div>
          </div>
          <div class="card">
            <h2>Notes for Clinicians</h2>
            <div class="meta">Auto-generated overview based on last 30 days</div>
            <p>
              This report summarizes recent readings for review. Values outside common ranges are highlighted in the app and should be assessed in clinical context.
            </p>
          </div>
        </body>
      </html>`;

    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  }

  static async sharePdf(uri: string): Promise<void> {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { dialogTitle: 'Share Health Report (PDF)' });
    }
  }
}


