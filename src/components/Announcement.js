import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { setAnnouncement } from "redux/modules/appState";
import { getAnnouncement } from "services/api";

const AnnouncementContainer = styled.div`
  width: "100%";
  display: ${(props) =>
    props.disabled ? "none" : props.isMobile ? "none" : "flex"};
  background-color: ${(props) => props.theme.color.primaryWhite};
  flex-direction: ${(props) => (props.isMobile ? "row" : "row")};
  align-items: center;
  font-size: 15px;
  gap: 5px;
  text-align: left;
  margin-bottom: 10px;
`;

const CTATextContainer = styled.div`
  background-color: ${(props) => props.theme.color.secondaryGolden};
  padding: 5px;
  border-radius: 5px;
`;

const CTALinkContainer = styled.a`
  color: ${(props) => props.theme.color.primaryPurple};
  font-weight: bold;
  text-decoration: underline;
`;

const Announcement = () => {
  const isMobile = useSelector((state) => state.appState.isMobile);
  const dispatch = useDispatch();

  const [config, setConfig] = useState(null);
  const [isShowNotification, setIsShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationLink, setNotificationLink] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [linkText, setLinkText] = useState("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const response = await getAnnouncement();
      setConfig(response.data.records);
    }

    fetchAnnouncement();
  }, []);

  useEffect(() => {
    if (config) {
      config.forEach((configItem) => {
        switch (configItem.fields.config_name) {
          case "show_notification":
            const isAnnouncement = configItem.fields.config_value === "true";
            dispatch(setAnnouncement(isAnnouncement));
            setIsShowNotification(isAnnouncement);
            break;
          case "notification_text":
            setNotificationText(configItem.fields.config_value);
            break;
          case "notification_link":
            setNotificationLink(configItem.fields.config_value);
            break;
          case "cta_text":
            setCtaText(configItem.fields.config_value);
            break;
          case "link_text":
            setLinkText(configItem.fields.config_value);
            break;
          default:
            break;
        }
      });
    }
  }, [config, dispatch]);

  return (
    <AnnouncementContainer disabled={!isShowNotification} isMobile={isMobile}>
      <CTATextContainer>{ctaText}</CTATextContainer>
      <div>
        {notificationText} <span style={{ marginRight: "5px" }}>-</span>
        <CTALinkContainer target="_blank" href={notificationLink}>
          {linkText}
        </CTALinkContainer>
      </div>
    </AnnouncementContainer>
  );
};

export default Announcement;
