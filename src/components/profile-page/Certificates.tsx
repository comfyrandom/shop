import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCertificate, faMedal, faStar} from "@fortawesome/free-solid-svg-icons";
import type {Certificate} from "../../types/userProfile.ts";

interface CertificatesProps {
    certificates?: Certificate[]
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
    if (!certificates) {
        certificates = []
    }

    const sortedCertificates = [...certificates].sort((a, b) => {
        if (a.certificate_level === "Special" && b.certificate_level !== "Special") {
            return -1;
        }
        if (a.certificate_level !== "Special" && b.certificate_level === "Special") {
            return 1;
        }
        return 0;
    });

    return (
        <>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faMedal} className="text-blue-500 mr-2" />
                Сертификаты
            </h2>
            <div className="space-y-4">
                {certificates.length > 0 && sortedCertificates.map((cert, index) => (
                    <div
                        key={index}
                        className={`rounded-lg p-4 ${cert.certificate_level === "Special" ?
                            "bg-gradient-to-r from-gray-800 to-gray-700 shadow-lg border border-gray-600" :
                            "bg-white shadow-sm border border-gray-200"
                        }`}
                    >
                        <div className="flex items-start">
                            <div className={`p-2 rounded-lg mr-3 ${
                                cert.certificate_level === "Special" ? "bg-gray-700 text-amber-400" :
                                    cert.certificate_level === "Platinum" ? "bg-gray-100 text-gray-800" :
                                        cert.certificate_level === "Gold" ? "bg-amber-50 text-amber-800" :
                                            "bg-blue-50 text-blue-800"
                            }`}>
                                <FontAwesomeIcon icon={faCertificate} />
                            </div>
                            <div className={cert.certificate_level === "Special" ? "text-amber-50" : ""}>
                                <h3 className={`font-medium ${
                                    cert.certificate_level === "Special" ? "text-amber-300" : ""
                                }`}>
                                    {cert.certificate_name}
                                </h3>
                                <p className={`text-sm ${
                                    cert.certificate_level === "Special" ? "text-amber-200" : "text-gray-600"
                                }`}>
                                    {cert.certificate_level} уровень · {cert.year}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {certificates.length === 0 && (
                    <div className="text-center py-8 px-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 text-blue-500">
                            <FontAwesomeIcon icon={faStar} size="2x" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">
                            Пока нет сертификатов
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Здесь будут отображаться сертификаты, когда пользователь их получит
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Certificates;