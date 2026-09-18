import { useState, useRef } from 'react';
import pixelmatch from 'pixelmatch';
import { AlertTriangle, CheckCircle2, Upload, ShieldAlert, Loader2 } from 'lucide-react';

export default function RepairVerification() {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [requiresManualReview, setRequiresManualReview] = useState(false);
  const [diffPercentage, setDiffPercentage] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);

  const loadImageToCanvas = (
    file: File,
    canvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number,
  ): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas 2d context'));
          return;
        }
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        resolve(ctx.getImageData(0, 0, targetWidth, targetHeight));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleVerify = async () => {
    if (!beforeFile || !afterFile) {
      setError('Please upload both a Before and an After photo.');
      return;
    }

    const beforeCanvas = beforeCanvasRef.current;
    const afterCanvas = afterCanvasRef.current;
    if (!beforeCanvas || !afterCanvas) {
      setError('Canvas elements are not available.');
      return;
    }

    setVerifying(true);
    setError(null);
    setRequiresManualReview(false);
    setDiffPercentage(null);

    try {
      // Load the "before" image at its native size to determine dimensions
      const sizeProbe = new Image();
      const beforeUrl = URL.createObjectURL(beforeFile);
      await new Promise<void>((resolve, reject) => {
        sizeProbe.onload = () => resolve();
        sizeProbe.onerror = () => reject(new Error('Failed to probe image size'));
        sizeProbe.src = beforeUrl;
      });

      const width = sizeProbe.naturalWidth;
      const height = sizeProbe.naturalHeight;
      URL.revokeObjectURL(beforeUrl);

      const beforeData = await loadImageToCanvas(beforeFile, beforeCanvas, width, height);
      const afterData = await loadImageToCanvas(afterFile, afterCanvas, width, height);

      const totalPixels = width * height;
      const mismatchedPixels = pixelmatch(
        beforeData.data,
        afterData.data,
        null,
        width,
        height,
        { threshold: 0.1 },
      );

      const percentage = (mismatchedPixels / totalPixels) * 100;
      setDiffPercentage(parseFloat(percentage.toFixed(2)));

      if (percentage < 5) {
        setRequiresManualReview(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during verification.');
    } finally {
      setVerifying(false);
    }
  };

  const previewUrl = (file: File | null) => (file ? URL.createObjectURL(file) : null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Repair Verification
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Upload before &amp; after photos to verify that a legitimate repair was performed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Before Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Before Photo
          </label>
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors overflow-hidden">
            {beforeFile ? (
              <img
                src={previewUrl(beforeFile)!}
                alt="Before preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={28} />
                <span className="text-sm">Upload Before Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setBeforeFile(e.target.files?.[0] ?? null);
                setDiffPercentage(null);
                setRequiresManualReview(false);
                setError(null);
              }}
            />
          </label>
        </div>

        {/* After Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            After Photo
          </label>
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors overflow-hidden">
            {afterFile ? (
              <img
                src={previewUrl(afterFile)!}
                alt="After preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={28} />
                <span className="text-sm">Upload After Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setAfterFile(e.target.files?.[0] ?? null);
                setDiffPercentage(null);
                setRequiresManualReview(false);
                setError(null);
              }}
            />
          </label>
        </div>
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={verifying || !beforeFile || !afterFile}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {verifying ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analysing…
          </>
        ) : (
          'Verify Repair'
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Fraud Alert */}
      {requiresManualReview && diffPercentage !== null && (
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-sm">
          <ShieldAlert size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-semibold text-base mb-1">Fraud Alert: Images are identical</p>
            <p>
              Pixel difference is only <strong>{diffPercentage}%</strong> (threshold: 5%).
              This project has been flagged and <strong>requires manual review</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Pass result */}
      {diffPercentage !== null && !requiresManualReview && (
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>
            Images differ by <strong>{diffPercentage}%</strong>. Repair appears legitimate.
          </span>
        </div>
      )}

      {/* Hidden canvases for pixel extraction */}
      <canvas ref={beforeCanvasRef} className="hidden" />
      <canvas ref={afterCanvasRef} className="hidden" />
    </div>
  );
}
