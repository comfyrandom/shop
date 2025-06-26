import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBolt, faCoins, faCrown} from "@fortawesome/free-solid-svg-icons";

interface ExtrasProps {
    extras: Array<{
        name: string;
        description: string;
        value: string;
        exclusive: boolean;
    }>
}

const Extras: React.FC<ExtrasProps> = ({ extras }) => {
    return (
        <div className="space-y-4">
            {extras.map((extra, index) => (
                <div key={index} className="group relative flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/10">
                    <div
                        className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-white-100 to-blue-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBolt} className="w-5 h-5 text-blue-500"/>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-lg font-bold text-gray-800">{extra.name}</h4>
                            {extra.exclusive && (
                                <span
                                    className="text-xs bg-gradient-to-r from-blue-400 to-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                                    <FontAwesomeIcon icon={faCrown} className="w-3 h-3"/>
                                    EXCLUSIVE
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-700 mt-3 mb-3">{extra.description}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 mb-1">VALUE ESTIMATE</span>
                                <div
                                    className="px-3 py-2 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCoins} className="w-3 h-3 text-amber-500"/>
                                    <span className="text-sm font-mono font-medium text-gray-800">
                                        {extra.value}
                                    </span>
                                </div>
                            </div>
                            {extra.exclusive && (
                                <span className="text-xs text-blue-800/80 self-end mb-1">Limited availability</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Extras;