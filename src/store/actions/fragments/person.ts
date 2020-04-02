import gql from 'graphql-tag';
import * as moment from 'moment';

import { PersonBirthday } from '../../../generated/PersonBirthday';

export const DEFAULT_SUFFIXES = ['Sr.', 'Jr.', 'II', 'III', 'IV', 'V'];

export const PERSON_NAME_FRAGMENT = gql`
  fragment PersonName on Person {
    firstName
    middleName
    lastName
    suffix
    fullName
  }
`;

export const PERSON_BIRTHDAY_FRAGMENT = gql`
  fragment PersonBirthday on Person {
    birthMonth
    birthYear
    dayOfBirth
    birthdayRaw
  }
`;

export function fromDateString(input: string | undefined | null): PersonBirthday {
  const trimmed = (input || '').trim();
  const date = moment(trimmed, ['MM/DD/YYYY', 'M/DD/YYYY', 'M/D/YYYY', 'MM/D/YYYY'], true);

  return {
    __typename: 'Person',
    birthdayRaw: trimmed || null,
    birthMonth: date.isValid() ? date.month() + 1 : null,
    birthYear: date.isValid() ? date.year() : null,
    dayOfBirth: date.isValid() ? date.date() : null,
  };
}

export function getBirthdayDate(input: PersonBirthday | undefined | null): moment.Moment | undefined {
  if (!input) return undefined;

  if (input.birthYear && input.birthMonth && input.dayOfBirth) {
    const date = moment({ year: input.birthYear, month: input.birthMonth - 1, day: input.dayOfBirth });
    return date.isValid() ? date : undefined;
  }

  const trimmed = (input.birthdayRaw || '').trim();
  const date = moment(trimmed, ['MM/DD/YYYY', 'M/DD/YYYY', 'M/D/YYYY', 'MM/D/YYYY'], true);
  return date.isValid() ? date : undefined;
}

export function getFullName({
  firstName,
  middleName,
  lastName,
  suffix,
}: { firstName?: string | null; middleName?: string | null; lastName?: string | null; suffix?: string | null } = {}) {
  let name = firstName || '';
  if (middleName) {
    name += (name ? ' ' : '') + middleName;
  }

  if (lastName) {
    name += (name ? ' ' : '') + lastName;
  }

  if (suffix) {
    name += (name ? ', ' : '') + suffix;
  }

  return name;
}
