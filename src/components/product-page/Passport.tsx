import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFingerprint, faIdCard} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import type { PassportData } from '../../types/product';
import {useAuth} from "../../hooks/useAuth.ts";

interface PassportProps {
    passport: PassportData;
}

const Passport : React.FC<PassportProps> = ({passport}) => {

    const { user } = useAuth();
    const [authorized, setAuthorized] = useState<boolean>(false);

    useEffect(() => {
        setAuthorized(!!user);
    }, [user?.id])

    const redactLastName = (name: string) => {
        if (!name) return '';
        return `${name.charAt(0)}${'•'.repeat(name.length - 1)}`;
    };

    const redactPassportNumber = (number: string) => {
        if (!number) return '';
        const visiblePart = number.slice(0, 4);
        const redactedPart = '•'.repeat(number.length - 4);
        return `${visiblePart} ${redactedPart}`;
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-lg">
            <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-xs mr-3">
                    <FontAwesomeIcon
                        icon={faIdCard}
                        className="text-blue-500 text-sm"
                        style={{ transform: 'scale(0.9)' }}
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800 text-base leading-tight">
                        {passport.last_name ? (authorized ? passport.last_name : redactLastName(passport.last_name)) : ''} {passport.first_name ?? ''} {passport.middle_name ?? ''}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">№ {authorized ? passport.passport_number : redactPassportNumber(passport.passport_number)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-sm">
                <div className="bg-white/80 p-2 rounded">
                    <p className="text-xs text-gray-500 mb-1">Дата рождения</p>
                    <p className="font-medium leading-tight">{passport.date_of_birth ? moment(passport.date_of_birth).format('DD.MM.yyyy') : '-'}</p>
                </div>

                <div className="bg-white/80 p-2 rounded">
                    <p className="text-xs text-gray-500 mb-1">Пол</p>
                    <p className="font-medium leading-tight">{passport.gender && passport.gender !== '' ? passport.gender : '-'}</p>
                </div>

                {passport.issue_date &&
                    <div className="bg-white/80 p-2 rounded col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Дата выдачи</p>
                        <p className="font-medium leading-tight">{moment(passport.issue_date).format('DD.MM.yyyy')}</p>
                    </div>
                }

                {passport.issued_by &&
                    <div className="bg-white/80 p-2 rounded col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Кем выдан</p>
                        <p className="font-medium leading-tight">{passport.issued_by}</p>
                    </div>
                }

                {passport.place_of_birth &&
                    <div className="bg-white/80 p-2 rounded col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Место рождения</p>
                        <p className="font-medium leading-tight">{passport.place_of_birth}</p>
                    </div>
                }

                {passport.registration &&
                    <div className="bg-white/80 p-2 rounded col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Прописка</p>
                        <p className="font-medium leading-tight">{passport.registration}</p>
                    </div>
                }
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200/50 flex items-center">
                <FontAwesomeIcon icon={faFingerprint} className="text-amber-500 mr-1.5 text-xs" />
                <span className="text-xs font-mono text-gray-600">ID: {passport.biometric_id}</span>
            </div>
        </div>
    );
};

export default Passport;