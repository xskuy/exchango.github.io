"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader,
  Check,
  Smartphone,
  AlertTriangle,
  Clock,
  ArrowRight,
  Shield,
  X,
} from "lucide-react";

interface SecurityVerificationProps {
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  receivedAmount: number;
  currency: string;
  paymentMethod: string;
}

export function SecurityVerification({
  onClose,
  onSuccess,
  amount,
  receivedAmount,
  currency,
  paymentMethod,
}: SecurityVerificationProps) {
  const [step, setStep] = useState<"password" | "2fa" | "success">("password");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const transactionRisk = {
    level: "alto",
    requires2FA: amount > 1000,
    reason: "Monto superior a $1,000",
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular verificación
    setTimeout(() => {
      if (password === "1234") {
        if (transactionRisk.requires2FA) {
          setStep("2fa");
        } else {
          setStep("success");
        }
      } else {
        setError("Contraseña incorrecta. Por favor, intenta nuevamente.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular verificación 2FA
    setTimeout(() => {
      if (otpCode === "123456") {
        setStep("success");
        onSuccess();
      } else {
        setError("Código incorrecto. Por favor, revisa e intenta nuevamente.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const renderPasswordStep = () => (
    <div className="space-y-6">
      {/* Indicador de Seguridad */}
      <div className="bg-orange-50 p-4 rounded-lg flex gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
        <div className="text-sm">
          <p className="font-medium text-orange-800">Verificación adicional requerida</p>
          <p className="text-orange-700 mt-1">
            Esta transacción requiere autenticación de dos factores por {transactionRisk.reason}
          </p>
        </div>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full pl-4 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-3">
          <h4 className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Detalles de la transacción
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-blue-700">Monto:</span>
            <span className="text-blue-900 font-medium">${amount.toFixed(2)} USD</span>
            <span className="text-blue-700">Recibirás:</span>
            <span className="text-blue-900 font-medium">
              {receivedAmount.toFixed(2)} {currency}
            </span>
            <span className="text-blue-700">Método:</span>
            <span className="text-blue-900">{paymentMethod}</span>
            <span className="text-blue-700">Tiempo estimado:</span>
            <span className="text-blue-900">1-2 minutos</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !password}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
            isLoading || !password
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4" />
              Continuar
            </>
          )}
        </button>
      </form>
    </div>
  );

  const render2FAStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">Verificación en dos pasos</h3>
        <p className="text-sm text-gray-600 mt-1">Ingresa el código de 6 dígitos de tu aplicación de autenticación</p>
      </div>

      <form onSubmit={handle2FASubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center border rounded-lg text-lg font-bold"
                value={otpCode[i] || ""}
                onChange={(e) => {
                  const newCode = otpCode.split("");
                  newCode[i] = e.target.value;
                  setOtpCode(newCode.join(""));
                  if (e.target.value && e.target.nextSibling) {
                    (e.target.nextSibling as HTMLInputElement).focus();
                  }
                }}
              />
            ))}
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
          <Clock className="w-4 h-4" />
          <span>Código válido por 3:00 minutos</span>
        </div>

        <button
          type="submit"
          disabled={isLoading || otpCode.length !== 6}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
            isLoading || otpCode.length !== 6
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Confirmar compra
            </>
          )}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold">¡Compra exitosa!</h3>
      <p className="text-gray-600">Tu transacción se ha procesado correctamente</p>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">ID de transacción:</span>
          <span className="font-medium">TRX-123456789</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Estado:</span>
          <span className="text-green-600 font-medium">Completada</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tiempo de procesamiento:</span>
          <span className="font-medium">2 minutos</span>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button className="w-full bg-black text-white rounded-lg py-3">Ver detalles de la transacción</button>
        <button className="w-full border border-gray-300 rounded-lg py-3">Volver al inicio</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {step === "password" && renderPasswordStep()}
        {step === "2fa" && render2FAStep()}
        {step === "success" && renderSuccessStep()}
      </div>
    </div>
  );
}
