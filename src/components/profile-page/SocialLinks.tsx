import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faCopy,
    faCheck,
    faExternalLinkAlt,
    faGlobe
} from "@fortawesome/free-solid-svg-icons";
import {
    faDiscord,
    faTelegram,
    faTwitter,
    faGithub,
    faDeviantart, type IconDefinition
} from "@fortawesome/free-brands-svg-icons";
import type {Socials} from "../../types/userProfile.ts";

type SocialLinkType = 'discord' | 'telegram' | 'email' | 'twitter' | 'github' | 'deviantart' | 'website';

interface SocialLinkProps {
    type: SocialLinkType;
    value: string;
    url?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ type, value, url }) => {
    const [copied, setCopied] = React.useState(false);
    const isCopyable = type === 'discord' || type === 'telegram' || type === 'email';

    const handleClick = () => {
        if (isCopyable) {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return;
        }

        let link = url;
        if (!link) {
            switch (type) {
                case 'twitter':
                    link = `https://twitter.com/${value.replace('@', '')}`;
                    break;
                case 'github':
                    link = `https://github.com/${value}`;
                    break;
                case 'deviantart':
                    link = `https://deviantart.com/${value}`;
                    break;
                case 'website':
                    link = value.startsWith('http') ? value : `https://${value}`;
                    break;
            }
        }

        if (link) {
            window.open(link, '_blank');
        }
    };

    const getIconConfig = () => {
        const configs: Record<SocialLinkType, { icon: IconDefinition; color: string }> = {
            discord: {
                icon: faDiscord,
                color: 'text-indigo-600',
            },
            telegram: {
                icon: faTelegram,
                color: 'text-blue-500',
            },
            email: {
                icon: faEnvelope,
                color: 'text-gray-600',
            },
            twitter: {
                icon: faTwitter,
                color: 'text-sky-500',
            },
            github: {
                icon: faGithub,
                color: 'text-gray-700',
            },
            deviantart: {
                icon: faDeviantart,
                color: 'text-green-600',
            },
            website: {
                icon: faGlobe,
                color: 'text-blue-600',
            }
        };
        return configs[type] || configs.website;
    };

    const { icon, color } = getIconConfig();

    return (
        <button
            onClick={handleClick}
            className={`flex items-center bg-white border border-gray-200 px-4 py-2 rounded-full 
                        shadow-sm transition-all duration-200 hover:shadow-md 
                        focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-300`}
            title={isCopyable ? `Копировать ${value}` : `Открыть ${value}`}
        >
            <FontAwesomeIcon
                icon={icon}
                className={`${color} mr-3 text-lg`}
            />
            <span className="font-medium text-gray-700">{value}</span>

            <span className="ml-3 text-gray-400">
                {isCopyable ? (
                    <FontAwesomeIcon
                        icon={copied ? faCheck : faCopy}
                        className={copied ? 'text-green-500' : ''}
                        size="xs"
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faExternalLinkAlt}
                        size="xs"
                    />
                )}
            </span>
        </button>
    );
};

interface SocialLinksProps {
    socials?: Socials;
    className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ socials, className }) => {
    if (!socials) return null;

    const hasAnySocial = Object.entries(socials).some(
        ([key, val]) => key !== 'custom' && val
    );

    if (!hasAnySocial) return null;

    return (
        <div className={`${className || ''}`}>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Контакты</h3>
            <div className="flex flex-wrap gap-3">
                {socials.discord && <SocialLink type="discord" value={socials.discord} />}
                {socials.telegram && <SocialLink type="telegram" value={socials.telegram} />}
                {socials.email && <SocialLink type="email" value={socials.email} />}
                {socials.twitter && <SocialLink type="twitter" value={socials.twitter} />}
                {socials.github && <SocialLink type="github" value={socials.github} />}
                {socials.deviantart && <SocialLink type="deviantart" value={socials.deviantart} />}
                {socials.website && <SocialLink type="website" value={socials.website} />}
            </div>
        </div>
    );
};