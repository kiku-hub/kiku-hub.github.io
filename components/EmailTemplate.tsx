import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  message,
}) => (
  <Html>
    <Head />
    <Preview>新しいお問い合わせがありました</Preview>
    <Tailwind>
      <Body>
        <Container>
          <Heading>お問い合わせフォーム</Heading>
          <Section>
            <Text>名前: {name}</Text>
            <Text>メールアドレス: {email}</Text>
            <Text>メッセージ:</Text>
            <Text>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailTemplate;
